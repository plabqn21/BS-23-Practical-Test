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
    public class PostCommentController : Controller
    {
       
        private ICoreService CoreService;
        private readonly ApplicationDbContext db;
        public PostCommentController( ICoreService oCoreService, ApplicationDbContext odb)
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
        public async Task<JsonResult> SaveComment([FromBody] PostComment entity)
        {
            var userId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);

            try
            {
                if (userId == "" || userId == null) { return Json("Please Login first"); }
                entity.ApplicationUserId = userId;
                entity.DateAdded = DateTime.UtcNow;
                entity.Id = db.GenerateUniqueId();
                entity.Like = 0;
                entity.DisLike = 0;
                await db.AddAsync(entity);
                await db.SaveChangesAsync();
                return Json("true");
            }
            catch (Exception ex) {
                return Json(ex.InnerException.Message.ToString());
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetTableData()
        {
           
            var Post = CoreService.GetDataDictCollection(@"Select MP.Id,MP.PostDetails,MP.DateAdded,'Post '+ Cast(MP.PostNo as varchar) PostNo,u.Name,NoOfComment=(Select Count(Id) from PostComment where MasterPostId=Mp.Id) from MasterPost MP
                                                        inner join AspNetUsers u on u.Id = MP.ApplicationUserId
                                                        order by MP.PostNo asc");
            var Comment =CoreService.GetDataDictCollection(@"Select * from PostComment");
            var data = Tuple.Create(Post,Comment);
            return Json(data);
        }
       
    }
}