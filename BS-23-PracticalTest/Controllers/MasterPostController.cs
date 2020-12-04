using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BS_23_PracticalTest;
using BS_23_PracticalTest.Models;
using BS_23_PracticalTest.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace APP.Controllers.Common
{
    public class MasterPostController : Controller
    {
       
        private ICoreService CoreService;
        private readonly ApplicationDbContext db;
        public MasterPostController( ICoreService oCoreService, ApplicationDbContext odb)
        {
            db = odb;
            CoreService = oCoreService;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
          
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> Index([FromBody] MasterPost entity)
        {
           
            var response = "false";
            if (entity != null)
            {
                try
                {
                    var userId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);

                    if (userId == "" || userId == null) { return Json("Please Login first"); }
                    entity.ApplicationUserId = userId;
                    if (entity.Id == null || entity.Id == "")
                    {
                      
                        entity.Id = db.GenerateUniqueId();
                        entity.PostNo = db.MasterPostList.Count()+1;
                        db.MasterPostList.Add(entity);
                        entity.DateAdded = DateTime.UtcNow;
                        await db.SaveChangesAsync();
                        response = "true";
                    }
                    else
                    {
                        var data = await db.MasterPostList.AsNoTracking().FirstOrDefaultAsync(x => x.Id == entity.Id);
                        if (data == null) { response = "Data not found with id."; }
                        else
                        {
                            data.PostDetails = entity.PostDetails;
                            db.MasterPostList.Update(data);
                            await db.SaveChangesAsync();
                            response = "true";
                        }

                    }

                }
                catch (Exception ex)
                {
                    response= ex.InnerException.Message.ToString();
                }
            }

            return Json(response);
        }
        [HttpGet]
        public async Task<JsonResult> GetTableData()
        {
           
            var data = CoreService.GetDataDictCollection(@"Select MP.Id,MP.PostDetails,MP.DateAdded,'Post '+ Cast(MP.PostNo as varchar) PostNo,u.Name from MasterPost MP
                                                        inner join AspNetUsers u on u.Id = MP.ApplicationUserId
                                                        order by MP.PostNo asc");
            return Json(data);
        }
        [HttpGet]
        public async Task<JsonResult> GetSingleMasterPost(string Id)
        {
            var MasterPost = await db.MasterPostList.AsNoTracking().FirstOrDefaultAsync(x => x.Id == Id);
            return Json(MasterPost);
        }

        public async Task<JsonResult> Delete(string id)
        {
            var response = "false";
            if (id != "" && id != null)
            {
                try
                {
                    var entity = await db.MasterPostList.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
                    
                    db.MasterPostList.Remove(entity);
                    db.SaveChanges();
                    response = "true";
                }
                catch (Exception ex)
                {
                    response = ex.InnerException.Message.ToString();
                }
            }
            return Json(response);
        }
       
    }
}