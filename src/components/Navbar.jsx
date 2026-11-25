import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
export default function Navbar() {
  const [scrolled,setScrolled]=useState(false),[open,setOpen]=useState(false);
  useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>30);scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);},[]);
  const go=(id,e)=>{e?.preventDefault();setOpen(false);if(id==='customizer')window.dispatchEvent(new Event('pizza:build'));else document.getElementById(id)?.scrollIntoView({behavior:'smooth'});};
  return <header className={`site-nav ${scrolled?'is-scrolled':''}`}>
    <nav className="nav-left" aria-label="Main"><a href="#customizer" onClick={e=>go('customizer',e)}>YOUR PIE</a><a href="#delivery" onClick={e=>go('delivery',e)}>DELIVERY</a></nav>
    <a className="brand" href="#" aria-label="High Toss home" onClick={e=>{e.preventDefault();setOpen(false);window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({top:0,behavior:'smooth'});}}>HIGH <i/> TOSS</a>
    <div className="nav-right"><a className="menu-link" href="#menu" onClick={e=>go('menu',e)}>MENU</a><button className="nav-build" onClick={e=>go('customizer',e)}>BUILD A PIE <ArrowUpRight size={14}/></button><button className="mobile-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button></div>
    {open&&<nav className="mobile-drawer" aria-label="Mobile">{[['customizer','YOUR PIE'],['delivery','DELIVERY'],['reviews','REVIEWS'],['menu','MENU']].map(([id,label])=><a key={id} href={`#${id}`} onClick={e=>go(id,e)}>{label}<ArrowUpRight size={16}/></a>)}</nav>}
  </header>;
}
