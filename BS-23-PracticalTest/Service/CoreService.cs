using BS_23_PracticalTest.Models.VM;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace BS_23_PracticalTest.Service
{
    public class CoreService : ICoreService
    {

        private readonly ApplicationDbContext db;
        private IHttpContextAccessor HttpContextAccessor;
        public CoreService(ApplicationDbContext odb, IHttpContextAccessor oHttpContextAccessor)
        {
            this.db = odb;
            HttpContextAccessor = oHttpContextAccessor;
        }


        #region Generic/Raw Query Execution
        public async Task<Dictionary<string, object>> GetDataAsync(string query, bool pascalCase = false)
        {
            var fields = new List<string>();
            var dataRow = new Dictionary<string, object>();

            using (var command = db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                await db.Database.OpenConnectionAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    for (var i = 0; i < reader.FieldCount; i++)
                    {
                        fields.Add(reader.GetName(i));
                    }

                    if (reader.Read())
                    {
                        dataRow = GetDataDict(fields, reader, pascalCase);
                    }
                }

                await db.Database.CloseConnectionAsync();
            }

            return dataRow;
        }

        private Dictionary<string, object> GetDataDict(IEnumerable<string> fields, IDataRecord reader, bool pascalCase = false)
        {
            var dataDict = new Dictionary<string, object>();

            foreach (var colName in fields)
            {
                var ordinal = reader.GetOrdinal(colName);
                var value = reader.GetValue(ordinal);
                var type = reader.GetDataTypeName(ordinal);

                var mappedFieldName = pascalCase ? colName.Substring(0, 1).ToLower() + colName.Substring(1, colName.Length - 2) + colName.Substring(colName.Length - 1, 1).ToLower() : colName;

                switch (type)
                {
                    case "bigint":
                        dataDict[mappedFieldName] = value.ToString();
                        break;
                    default:
                        dataDict[mappedFieldName] = value;
                        break;
                }
            }

            return dataDict;

        }

        public IEnumerable<Dictionary<string, object>> GetDataDictCollection(string query)
        {
            var fields = new List<string>();
            var dataTable = new List<Dictionary<string, object>>();

            using (var command = db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                db.Database.OpenConnection();

                using (var reader = command.ExecuteReader())
                {
                    for (var i = 0; i < reader.FieldCount; i++)
                    {
                        fields.Add(reader.GetName(i));
                    }

                    while (reader.Read())
                    {
                        dataTable.Add(GetDataDict(fields, reader));
                    }
                }

                db.Database.CloseConnection();
            }

            return dataTable;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetDataDictCollectionAsync(string query)
        //IsAsynchronous just for method moveloading no use
        {
            var fields = new List<string>();
            var dataTable = new List<Dictionary<string, object>>();

            using (var command = db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                await db.Database.OpenConnectionAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    for (var i = 0; i < reader.FieldCount; i++)
                    {
                        fields.Add(reader.GetName(i));
                    }

                    while (reader.Read())
                    {
                        dataTable.Add(GetDataDict(fields, reader));
                    }
                }

                await db.Database.CloseConnectionAsync();
            }

            return dataTable;
        }
        public async Task<bool> ExecuteNonQuery(string query)
        {
            var response = false;
            using (var command = db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                db.Database.OpenConnection();

                await command.ExecuteNonQueryAsync();

                db.Database.CloseConnection();
                response = true;
            }

            return response;
        }
        #endregion


        #region Load ComboModel


        public async Task<List<ComboModel>> LoadComboModel(string commandText, string valueField, string textField)
        {
            return await LoadComboModel(commandText, valueField, textField, string.Empty);
        }

        public async Task<List<ComboModel>> LoadComboModel(string commandText, string valueField, string textField, string descField)
        {
            var comboList = new List<ComboModel>();
            var fields = new Dictionary<string, string>();

            using (var command = db.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = commandText;

                db.Database.OpenConnection();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    for (var i = 0; i < reader.FieldCount; i++)
                    {
                        var name = reader.GetName(i);

                        if (name.Equals(valueField, StringComparison.CurrentCultureIgnoreCase))
                        {
                            fields["ValueField"] = name;
                        }

                        if (name.Equals(textField, StringComparison.CurrentCultureIgnoreCase))
                        {
                            fields["TextField"] = name;
                        }

                        if (name.Equals(descField, StringComparison.CurrentCultureIgnoreCase))
                        {
                            fields["DescField"] = name;
                        }
                    }

                    while (reader.Read())
                    {
                        var combo = new ComboModel();
                        foreach (var field in fields.Values)
                        {
                            if (field.Equals(valueField, StringComparison.CurrentCultureIgnoreCase))
                            {
                                combo.Value = reader[field].ToString();
                            }

                            if (field.Equals(textField, StringComparison.CurrentCultureIgnoreCase))
                            {
                                combo.Text = reader[field].ToString();
                            }

                            if (field.Equals(descField, StringComparison.CurrentCultureIgnoreCase))
                            {
                                combo.Desc = reader[field].ToString();
                            }
                        }

                        comboList.Add(combo);
                    }
                }

                db.Database.CloseConnection();
            }

            return comboList;
        }

        #endregion

      
    }
}
