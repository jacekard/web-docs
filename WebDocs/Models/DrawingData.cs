using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDocs.Models
{
    public class DrawingData
    {

        public float PreviousX { get; set; }
        public float PreviousY { get; set; }

        public float CurrentX { get; set; }
        public float CurrentY { get; set; }

        public string Color { get; set; }
        public float Size { get; set; }
    }
}
