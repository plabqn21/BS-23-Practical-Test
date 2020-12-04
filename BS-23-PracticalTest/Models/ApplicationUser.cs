using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BS_23_PracticalTest.Models
{
    [Table("ApplicationUser")]
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [Column(TypeName = "NVARCHAR(38)")]
        public String Name { get; set; }


        [ForeignKey("CustomRole")]
        [Column(TypeName = "NVARCHAR(450)")]
        public string CustomRoleId { get; set; }
        public CustomRole CustomRole { get; set; }

        [Required]
        public bool IsApplicationAdmin { get; set; } = false;
    }
}
