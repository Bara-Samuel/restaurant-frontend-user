import {FaCalendarCheck, FaRegClock, FaBolt, FaFire} from 'react-icons/fa'
// =========================
// BUTTON STYLES
// =========================

export const commonTransition =
  "transition-all duration-300 active:scale-95";

export const addButtonBase =
  "relative flex items-center justify-center gap-2 px-5 py-2 rounded-full overflow-hidden font-semibold text-[#2D1B0E] bg-gradient-to-r from-green-400 to-green-600 shadow-lg";

export const addButtonHover =
  "hover:from-green-300 hover:to-green-500 hover:scale-105 hover:shadow-green-400/30";

  // ABOUT HOMEPAGE
  export const aboutfeature = [
    {icon:FaBolt, title:"Instant Ordering", text:"Seamless digital experience", color:"from-emerald-400 to-cyan-600"},
    {icon:FaRegClock, title:"Always Open", text:"24/7 Premium Service", color:"from rose-400 to pink-600"},
    {icon:FaCalendarCheck, title:"Exclusive Booking", text:"Priority reservations", color:"from-purple-400 to-indigo-600"},
    {icon:FaFire, title:"Signature Dishes", text:"Chef's special creations", color:"from-amber-400 to-orange-500"}
  ]