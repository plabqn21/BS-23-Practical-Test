using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BS_23_PracticalTest.Models
{[Table("PostComment")]
    public class PostComment
    {
        [Key]
        [Column(TypeName = "VARCHAR(42)")]
        public string Id { get; set; }

        [Required]
        [Column(TypeName = "VARCHAR(Max)")]
        public string CommentDetails { get; set; }

        [ForeignKey("MasterPost")]
        [Column(TypeName = "VARCHAR(42)")]
        public string MasterPostId { get; set; }
        public MasterPost MasterPost { get; set; }

        [ForeignKey("ApplicationUser")]
        [Column(TypeName = "NVARCHAR(450)")]
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        [Required]
        public DateTime DateAdded { get; set; }

        [Required]
        public int Like { get; set; }

        [Required]
        public int DisLike { get; set; }
    }
}
