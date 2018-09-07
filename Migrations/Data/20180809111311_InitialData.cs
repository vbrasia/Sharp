using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Sharp.Migrations.Data
{
    public partial class InitialData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Authorizations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Admin = table.Column<bool>(nullable: false),
                    BackOffice = table.Column<bool>(nullable: false),
                    Cashier = table.Column<bool>(nullable: false),
                    ChildTag = table.Column<string>(maxLength: 50, nullable: true),
                    Css = table.Column<string>(maxLength: 50, nullable: true),
                    Icon = table.Column<string>(maxLength: 50, nullable: true),
                    LineNo = table.Column<int>(nullable: false),
                    Live = table.Column<bool>(nullable: false),
                    Manager = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    RootTag = table.Column<string>(maxLength: 50, nullable: true),
                    Supervisor = table.Column<bool>(nullable: false),
                    Tag = table.Column<string>(maxLength: 50, nullable: true),
                    Type = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authorizations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Stores",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(maxLength: 100, nullable: true),
                    City = table.Column<string>(maxLength: 50, nullable: true),
                    DataBase = table.Column<string>(maxLength: 50, nullable: true),
                    MacAddress = table.Column<string>(maxLength: 100, nullable: true),
                    Port = table.Column<int>(nullable: false),
                    PostCode = table.Column<string>(maxLength: 10, nullable: true),
                    PublicIp = table.Column<string>(maxLength: 50, nullable: true),
                    SerialNumber = table.Column<string>(maxLength: 100, nullable: true),
                    StoreId = table.Column<string>(maxLength: 50, nullable: true),
                    StoreName = table.Column<string>(maxLength: 100, nullable: true),
                    Tick = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserStores",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Email = table.Column<string>(maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(maxLength: 20, nullable: true),
                    StoreId = table.Column<string>(maxLength: 50, nullable: true),
                    UserId = table.Column<string>(maxLength: 50, nullable: true),
                    UserRole = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStores", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Authorizations");

            migrationBuilder.DropTable(
                name: "Stores");

            migrationBuilder.DropTable(
                name: "UserStores");
        }
    }
}
