using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using FoehnWebApp.Models;

namespace FoehnWebApp.Controllers
{
    public class InformationController : Controller
    {

        private List<Information> information
        {
            get
            {
                if (Session["InformationList"] == null)
                {
                    Session["InformationList"] = new List<Information>();
                }
                return (List<Information>)Session["InformationList"];
            }
            set
            {
                Session["InformationList"] = value;
            }
        }

        public ActionResult showCreate()
        {
            return PartialView("_create");
        }


        public ActionResult Index()
        {
           
          


            return View(information);

        }
        public  ActionResult Display()
        {
            return Json(information,JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTotalSalary()
        {
            int totalSalary = information.Sum(x => x.Salary);
            return Json(totalSalary, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTotalLength()
        {
            int totalCount = information.Count;
            return Json(totalCount, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]

        public ActionResult Create(Information newInfo)
        {


            newInfo.Id = information.Count > 0 ? information.Max(x => x.Id) + 1 : 0;
            information.Add(newInfo);
            return Json(newInfo);



        }



        public ActionResult Edit(int Id)
        {
            var EditInfo = information.Find(i => i.Id == Id);


            //return PartialView("Edit", EditInfo);
            return Json(EditInfo, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
       

        public ActionResult Update(Information infoEdited)
        {

            var EditInfo = information.Find(i => i.Id == infoEdited.Id);
           
                EditInfo.FirstName = infoEdited.FirstName;
                EditInfo.LastName = infoEdited.LastName;
                EditInfo.Age = infoEdited.Age;
                EditInfo.Salary = infoEdited.Salary;

                return Json(EditInfo, JsonRequestBehavior.AllowGet);

          
        }


        public ActionResult Delete(int id)
        {
            var infoDelete = information.Find(i => i.Id == id);


            if (infoDelete != null)
            {
                information.Remove(infoDelete);



                return Json(new { success = true });
            }
            return HttpNotFound();
        }
        //public ActionResult Edit(int Id)
        //{
        //    var personInfo = personal.Find(x => x.Id == Id);

        //    return PartialView("Edit", personInfo);
        //}






        //[HttpPost]
        //public ActionResult Edit(Information info)
        //{
        //    var result = information.FirstOrDefault(i => i.Id == info.Id);


        //    result.FirstName = info.FirstName;

        //    result.LastName = info.LastName;
        //    result.Age = info.Age;
        //    result.Salary = info.Salary;

        //    return RedirectToAction("Index", "Home");


    }



}

