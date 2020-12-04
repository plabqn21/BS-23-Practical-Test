using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BS_23_PracticalTest.Models
{
    [Table("CustomRole")]
    public class CustomRole : IdentityRole
    {
        [Column(TypeName = "NVARCHAR(32)")]
        public string RoleName { get; set; }
       
    }
}
