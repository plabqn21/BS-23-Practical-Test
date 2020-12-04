using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BS_23_PracticalTest.Models
{
    [Table("MasterPost")]
    public  class MasterPost
    {
        [Key]
        [Column(TypeName = "VARCHAR(42)")]
        public string Id { get; set; }

        [Required]
        [Column(TypeName = "VARCHAR(Max)")]
        public string PostDetails { get; set; }

        [ForeignKey("ApplicationUser")]
        [Column(TypeName = "NVARCHAR(450)")]
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        [Required]
        public DateTime DateAdded { get; set; }
        [Required]
        public int PostNo { get; set; }

    }
}
