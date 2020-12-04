using BS_23_PracticalTest.Models.VM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS_23_PracticalTest.Service
{
    public interface ICoreService
    {
        Task<Dictionary<string, object>> GetDataAsync(string query, bool pascalCase = false);
        IEnumerable<Dictionary<string, object>> GetDataDictCollection(string query);      
        Task<List<ComboModel>> LoadComboModel(string commandText, string valueField, string textField);
     
    }
}
