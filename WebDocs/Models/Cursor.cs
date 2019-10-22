using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDocs.Models
{
    public class Cursor
    {
        public int UserId { get; set; } 
        public int OffsetLeft { get; set; }
        public int OffsetTop { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
    }
}
