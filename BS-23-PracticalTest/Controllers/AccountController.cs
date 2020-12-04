using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BS_23_PracticalTest.Models;
using BS_23_PracticalTest.Models.VM;
using BS_23_PracticalTest.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BS_23_PracticalTest.Controllers
{
    public class AccountController : Controller
    {
        private readonly RoleManager<CustomRole> roleManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ApplicationDbContext db;
        private ICoreService CoreService;

        public AccountController(ICoreService oCoreService, RoleManager<CustomRole> roleManager, ApplicationDbContext odb, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            CoreService = oCoreService;
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.signInManager = signInManager;
            db = odb;

        }
        #region Role
        [HttpGet]
        public IActionResult CreateRole()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> CreateRole([FromBody] CustomRole odata)
        {
            var response = "false";
            try
            {
                
                if (odata.Id == null || odata.Id == "")
                {
                    odata.Id = db.GenerateUniqueId();
                    odata.Name = odata.RoleName;
                    
                     var result = await roleManager.CreateAsync(odata);
                    if (result.Succeeded)
                    {
                        response = "true";
                    }
                    else
                    {
                        foreach (var error in result.Errors)
                        {
                            response = response + "," + error.Code;

                        }

                    }

                }

                else
                {
                    var existing = await db.CustomRoleList.AsNoTracking().FirstOrDefaultAsync(x => x.Id == odata.Id);
                    if (existing != null)
                    {

                        existing.RoleName = odata.RoleName;
                        var result = await roleManager.UpdateAsync(existing);
                        if (result.Succeeded)
                        {
                            response = "true";
                        }
                        else
                        {
                            foreach (var error in result.Errors)
                            {
                                response = response + "," + error.Code;

                            }

                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(response);
        }

        public async Task<JsonResult> GetRoleTableData()
        {
           
            var rolelist = await db.CustomRoleList.AsNoTracking().OrderBy(x => x.RoleName).ToListAsync();
            return Json(rolelist);
        }
        public async Task<JsonResult> GetSingleRole(string Id)
        {
            var role = await db.CustomRoleList.AsNoTracking().FirstOrDefaultAsync(x => x.Id == Id);
            return Json(role);
        }

        public async Task<JsonResult> DeleteRole(string id)
        {
            var role = await roleManager.FindByIdAsync(id);
           
            try
            {
                if (role == null)
                {
                    var ErrorMessage = $"Role with Id = {id} cannot be found";
                    return Json("false");
                }
                else
                {
                    var result = await roleManager.DeleteAsync(role);

                    if (result.Succeeded)
                    {

                        return Json("true");
                    }
                    else { return Json(result.Errors.ToString()); }
                }
            }
            catch (Exception ex)
            {
                return Json(ex.InnerException.Message.ToString());
            }
        }
        #endregion End Role

        #region User
        [HttpGet]

        public async Task<IActionResult> AddUser()
        {
            await InitializeDropdownAsync();
            return View();
        }

        [HttpPost]

        public async Task<JsonResult> AddUser([FromBody] ApplicationUserVM odata)
        {
            var response = "false";
            try
            {
               
                var email = await db.ApplicationUserList.AsNoTracking().FirstOrDefaultAsync(x => x.Id != odata.Id && (x.PhoneNumber == odata.PhoneNumber || x.Email == odata.Email));
                if (email != null)
                {
                    return Json("Email or Mobile was already registered. Try another.");
                }
                if (odata.Id == null || odata.Id == "")
                {

                    if (odata.Password != odata.ConfirmPassword)
                    {
                        return Json("Password and Confirm Password should be same.");
                    }

                    var username = db.ApplicationUserList.Count().ToString();
                    var User = new ApplicationUser
                    {
                        Id = db.GenerateUniqueId(),
                        Email = odata.Email,
                        PhoneNumber = odata.PhoneNumber,
                        UserName = username,
                        Name = odata.Name,
                        CustomRoleId=odata.CustomRoleId
                       
                       
                    };
                    var result = await userManager.CreateAsync(User, odata.Password);
                    if (result.Succeeded)
                    {
                        var role = await db.CustomRoleList.AsNoTracking().SingleAsync(x => x.Id == odata.CustomRoleId);
                        var Roleassignment = await userManager.AddToRoleAsync(User, role.Name);
                        if (Roleassignment.Succeeded)
                        {
                            return Json("true");
                        }
                        else { return Json("false"); }
                    }
                    else { return Json(result); }

                }

                else
                {
                    var user = db.ApplicationUserList.AsNoTracking().FirstOrDefault(x => x.Id == odata.Id);
                    var role = await db.CustomRoleList.AsNoTracking().SingleAsync(x => x.Id == user.CustomRoleId);
                    var Roleremove = await userManager.RemoveFromRoleAsync(user, role.Name);
                    if (user != null)
                    {
                        user.Email = odata.Email;
                        user.PhoneNumber = odata.PhoneNumber;
                        user.Name = odata.Name;
                        user.CustomRoleId = odata.CustomRoleId;
                        
                        var result = await userManager.UpdateAsync(user);
                        var Newrole = await db.CustomRoleList.AsNoTracking().SingleAsync(x => x.Id == user.CustomRoleId);
                        await userManager.AddToRoleAsync(user, Newrole.Name);
                        if (result.Succeeded)
                        {
                            return Json("true");
                        }
                        else { return Json(result); }
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(response);
        }


        public JsonResult GetApplicationUserTableData()
        {
            
            var Userlist = CoreService.GetDataDictCollection($@"Select au.Id,au.UserName,au.Email, au.PhoneNumber, au.Name, AspNetRoles.Name as Role from ASPNETUSERS au
                                                            inner join AspNetRoles on AspNetRoles.Id = au.CustomRoleId order by au.Name asc");
            return Json(Userlist);
        }

        public async Task<JsonResult> GetSingleApplicationUser(string Id)
        {
            var user = await CoreService.GetDataAsync($"Select Id,Email, PhoneNumber, Name,  CustomRoleId,'999999' as Password , '999999' as ConfirmPassword from AspnetUsers where Id='{Id}'");
            return Json(user);
        }
        public async Task<JsonResult> DeleteApplicationUser(string id)
        {
            var user = await db.ApplicationUserList.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
           
            if (user == null)
            {
                var ErrorMessage = $"No user found.";
                return Json("false");
            }
            else
            {
                var result = await userManager.DeleteAsync(user);

                if (result.Succeeded)
                {

                    return Json("true");
                }
                else { return Json("false"); }
            }
        }

        #endregion End User

        //#region LogIn Logout

        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<IActionResult> Login()
        //{
        //    var Package = await db.SoftwareBillTypeList.Where(x => x.IsActive == true).ToListAsync();
        //    ViewBag.SubscriptionInfo = Package.FirstOrDefault(x => x.IsSubscription == true);
        //    ViewBag.PackageInfo = Package.Where(x => x.IsSubscription == false);
        //    return View();
        //}


        //[HttpPost]
        //[AllowAnonymous]
        //public async Task<IActionResult> Login(SignInVM logInData, string returnUrl)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        HttpContext.Session.Clear();
        //        var user = await db.ApplicationUserList.AsNoTracking().SingleOrDefaultAsync(x => x.UserName == logInData.UserCode || x.PhoneNumber == logInData.UserCode || x.Email == logInData.UserCode);

        //        if (user == null)
        //        {
        //            ModelState.AddModelError(string.Empty, "User not found");
        //            var oPackage = await db.SoftwareBillTypeList.Where(x => x.IsActive == true).ToListAsync();
        //            ViewBag.SubscriptionInfo = oPackage.FirstOrDefault(x => x.IsSubscription == true);
        //            ViewBag.PackageInfo = oPackage.Where(x => x.IsSubscription == false);
        //            return View(logInData);
        //        }
        //        if (user.Status != "Active")
        //        {
        //            ModelState.AddModelError(string.Empty, "User is inactive.");
        //            var oPackage = await db.SoftwareBillTypeList.Where(x => x.IsActive == true).ToListAsync();
        //            ViewBag.SubscriptionInfo = oPackage.FirstOrDefault(x => x.IsSubscription == true);
        //            ViewBag.PackageInfo = oPackage.Where(x => x.IsSubscription == false);
        //            return View(logInData);
        //        }
        //        var result = await signInManager.PasswordSignInAsync(user.UserName, logInData.Password, false, lockoutOnFailure: false);

        //        if (result.Succeeded)
        //        {
        //            var RulesSetting = await db.RulesSettingList.FirstOrDefaultAsync(x => x.BranchId == user.BranchId);

        //            if (RulesSetting == null) { RulesSetting = new RulesSetting(); }
        //            HttpContext.Session.SetObject("_menus", null);
        //            HttpContext.Session.SetObject("UserSession", null);
        //            HttpContext.Session.SetObject("MedicineList", null);
        //            HttpContext.Session.SetObject("TestList", null);
        //            HttpContext.Session.SetObject("RulesSetting", null);
        //            HttpContext.Session.SetString("LicenseExpiredMessage", "");
        //            HttpContext.Session.SetObject("UserSession", user);
        //            HttpContext.Session.SetObject("RulesSetting", RulesSetting);


        //            var TestList = CoreService.GetDataDictCollection($@"Select * from (SELECT Id,Name,TestInstruction,RefValue,Type Form
        //                                                            FROM PersonolizeTest with(nolock) Where UserId = '{user.Id}'
        //                                                            Union  All
        //                                                            Select Id, Name, TestInstruction, RefValue, Type from Test with (nolock)
        //                                                            Where Id not in (Select Id from PersonolizeMedicine with (nolock)Where UserId = '{user.Id}'))x
        //                                                            order by Name asc").ToModelCollection<Test>();
        //            HttpContext.Session.SetObject("TestList", TestList);
        //            if (!user.HasOrgAccess)
        //            {
        //                var branch = db.BranchList.AsNoTracking().FirstOrDefault(x => x.Id == user.BranchId);

        //                if (branch.BranchName == null) { branch.BranchName = ""; }
        //                if (branch.Address == null) { branch.Address = ""; }
        //                if (user.Name == null) { user.Name = ""; }
        //                if (branch.Mobile == null) { branch.Mobile = ""; }
        //                if (branch.Email == null) { branch.Email = ""; }

        //                HttpContext.Session.SetString("BranchName", branch.BranchName);
        //                HttpContext.Session.SetString("BranchAddress", branch.Address);

        //                var IndexOfSpace = user.Name.IndexOf(" ");
        //                var FirstUserName = user.Name;
        //                if (IndexOfSpace > 0)
        //                {
        //                    FirstUserName = user.Name.Substring(0, IndexOfSpace);
        //                }

        //                HttpContext.Session.SetString("UserName", FirstUserName);
        //                HttpContext.Session.SetString("BranchMobile", branch.Mobile);
        //                HttpContext.Session.SetString("BranchEmail", branch.Email);

        //                if (user.IsApplicationAdmin == false)
        //                {
        //                    return RedirectToAction("Index", "home");
        //                }
        //                else { return RedirectToAction("AdminHome", "home"); }

        //            }
        //            else
        //            {
        //                return RedirectToAction("OrgSelection");
        //            }


        //        }

        //        ModelState.AddModelError(string.Empty, "Invalid Login Attempt");
        //    }
        //    var Package = await db.SoftwareBillTypeList.Where(x => x.IsActive == true).ToListAsync();
        //    ViewBag.SubscriptionInfo = Package.FirstOrDefault(x => x.IsSubscription == true);
        //    ViewBag.PackageInfo = Package.Where(x => x.IsSubscription == false);
        //    return View(logInData);

        //}
        //[AllowAnonymous]
        //public async Task<IActionResult> SignOut()
        //{
        //    HttpContext.Session.Clear();
        //    await signInManager.SignOutAsync();
        //    HttpContext.Session.SetObject("_menus", null);
        //    HttpContext.Session.SetObject("UserSession", null);
        //    HttpContext.Session.SetObject("RulesSetting", null);
        //    return RedirectToAction("Login", "Account");

        //}


        //[HttpGet]
        //public IActionResult ChangePassword() { return View(); }
        //[HttpPost]
        //public async Task<IActionResult> ChangePassword(PasswordChangeVM PasswordChangeVM)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var userCode = HttpContext.Session.GetObject<ApplicationUser>("UserSession").UserName;
        //        var result = await ChangeCurrentPassword(PasswordChangeVM, userCode);

        //        if (result == "True")
        //        {
        //            ModelState.AddModelError(string.Empty, "Successfully Changed Password. Please log in with new password.");

        //            await signInManager.SignOutAsync();

        //            return RedirectToAction("Login", "Account");


        //        }
        //        else
        //        {

        //            ModelState.AddModelError(string.Empty, result);
        //        }
        //    }

        //    return View(PasswordChangeVM);
        //}
        //public async Task<string> ChangeCurrentPassword(PasswordChangeVM passwordChangeVM, string userCode)
        //{

        //    if (passwordChangeVM.NewPassword != passwordChangeVM.NewPasswordConfirm)
        //    {
        //        return "New password does not match.";
        //    }

        //    var user = db.ApplicationUserList.AsNoTracking().FirstOrDefault(x => x.UserName == userCode);
        //    if (user.BranchId == "BRA-Test-1-1-1")
        //    {
        //        return "Test user's password can not be changed.";
        //    }

        //    // ChangePasswordAsync changes the user password
        //    var result = await userManager.ChangePasswordAsync(user,
        //        passwordChangeVM.OldPassword, passwordChangeVM.NewPassword);

        //    if (!result.Succeeded)
        //    {
        //        string errorstring = "";
        //        foreach (var error in result.Errors)
        //        {
        //            errorstring = errorstring + "," + error.Description;

        //        }
        //        return errorstring;
        //    }
        //    else
        //    {
        //        return "True";

        //    }




        //}

        //#endregion End LogIn Logout


        private async Task InitializeDropdownAsync()
        {
            
            ViewBag.Roles = await CoreService.LoadComboModel($"Select Id,Name from AspnetRoles with (nolock)", "Id", "Name"); ;
        }
    }
}

