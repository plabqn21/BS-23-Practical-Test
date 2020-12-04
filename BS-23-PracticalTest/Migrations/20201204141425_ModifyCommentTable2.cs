using Microsoft.EntityFrameworkCore.Migrations;

namespace BS_23_PracticalTest.Migrations
{
    public partial class ModifyCommentTable2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Like",
                table: "PostComment",
                newName: "CmtLikes");

            migrationBuilder.RenameColumn(
                name: "DisLike",
                table: "PostComment",
                newName: "CmtDisLikes");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CmtLikes",
                table: "PostComment",
                newName: "Like");

            migrationBuilder.RenameColumn(
                name: "CmtDisLikes",
                table: "PostComment",
                newName: "DisLike");
        }
    }
}
