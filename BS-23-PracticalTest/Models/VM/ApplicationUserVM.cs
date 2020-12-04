using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS_23_PracticalTest.Models.VM
{
    public class ApplicationUserVM
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserCode { get; set; }
        public string CustomRoleId { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public String Name { get; set; }       
        public String PhoneNumber { get; set; }

       
    }
}
