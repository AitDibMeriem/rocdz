import { useLang } from "@/context/LangContext";
import { Instagram, MapPin, Facebook, Youtube, Phone, Clock } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/rocdz_/";
const FACEBOOK_URL = "https://web.facebook.com/republicofcomputerdz";
const YOUTUBE_URL = "https://www.youtube.com/@republicofcomputerdz";
const MAPS_URL = "https://maps.app.goo.gl/oSViRUVb9935mY6z9";

function SocialBtn({ href, bg, icon, label }: { href: string; bg: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display:"flex",alignItems:"center",gap:"8px",padding:"0.65rem 1.4rem",borderRadius:"14px",background:bg,color:"white",textDecoration:"none",fontWeight:700,fontSize:"0.88rem",transition:"transform 0.2s, box-shadow 0.2s",flexShrink:0 }}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform="translateY(-3px)";el.style.boxShadow="0 12px 28px rgba(0,0,0,0.35)";}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform="";el.style.boxShadow="";}}
    >
      {icon}{label}
    </a>
  );
}

export default function About() {
  const { t, isRTL } = useLang();
  const a = t.about;

  return (
    <div dir={isRTL?"rtl":"ltr"} style={{overflowX:"hidden"}}>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section style={{position:"relative",minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"7rem 1.5rem 5rem",textAlign:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 70% at 50% 0%, rgba(232,33,160,0.22) 0%, transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"10%",left:"5%",width:"350px",height:"350px",background:"rgba(232,33,160,0.07)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"5%",right:"5%",width:"280px",height:"280px",background:"rgba(168,85,247,0.07)",borderRadius:"50%",filter:"blur(70px)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:"720px"}}>
          <img src="/logo.png" alt="ROC DZ" style={{height:"88px",objectFit:"contain",marginBottom:"2.5rem",filter:"drop-shadow(0 0 40px rgba(232,33,160,0.5))"}}/>
          <div style={{display:"inline-block",padding:"4px 18px",borderRadius:"999px",background:"rgba(232,33,160,0.12)",border:"1px solid rgba(232,33,160,0.3)",color:"var(--pink)",fontSize:"0.7rem",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",marginBottom:"1.5rem"}}>
            {a.subtitle}
          </div>
          <h1 style={{fontSize:"clamp(2.8rem,8vw,5rem)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",marginBottom:"1.25rem"}}>
            <span style={{display:"block",color:"var(--text)"}}>Republic of</span>
            <span style={{display:"block",background:"linear-gradient(135deg,#e821a0,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Computer DZ</span>
          </h1>
          <p style={{fontSize:"1rem",color:"var(--text-muted)",maxWidth:"480px",margin:"0 auto 3rem",lineHeight:1.75}}>
            {isRTL?"المرجع في بيع وصيانة أجهزة الكمبيوتر المحمولة في الجزائر — جديدة، مستعملة وملحقات بجودة عالية":"La référence des PC portables en Algérie — neufs, reconditionnés, accessoires. Livraison dans 68 wilayas."}
          </p>
          <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <SocialBtn href={INSTAGRAM_URL} bg="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" icon={<Instagram size={17}/>} label="@rocdz_"/>
            <SocialBtn href={FACEBOOK_URL} bg="#1877f2" icon={<Facebook size={17}/>} label="Facebook"/>
            <SocialBtn href={YOUTUBE_URL} bg="#ff0000" icon={<Youtube size={17}/>} label="YouTube"/>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════ */}
      <div style={{background:"rgba(232,33,160,0.06)",borderTop:"1px solid rgba(232,33,160,0.12)",borderBottom:"1px solid rgba(232,33,160,0.12)",padding:"2rem 1rem"}}>
        <div style={{maxWidth:"800px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",textAlign:"center"}}>
          {([["2M+","Abonnés","متابع"],["68","Wilayas","ولاية"],["5000+","Commandes","طلب"],["4.9/5","Avis Google","تقييم"]] as const).map(([n,fr,ar])=>(
            <div key={fr} style={{padding:"0.5rem"}}>
              <div style={{fontSize:"clamp(1.5rem,4vw,2.2rem)",fontWeight:900,background:"linear-gradient(135deg,#e821a0,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>{n}</div>
              <div style={{fontSize:"0.75rem",color:"var(--text-muted)",marginTop:"5px",fontWeight:500}}>{isRTL?ar:fr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES GRID ══════════════════════════════════ */}
      <section style={{padding:"5rem 1.5rem"}}>
        <div style={{maxWidth:"960px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
            <div style={{fontSize:"0.7rem",letterSpacing:"3px",textTransform:"uppercase",color:"var(--pink)",fontWeight:700,marginBottom:"0.6rem"}}>{isRTL?"خدماتنا":"Ce qu'on propose"}</div>
            <h2 style={{fontSize:"clamp(1.6rem,4vw,2.8rem)",fontWeight:900,letterSpacing:"-0.5px",color:"var(--text)"}}>
              {isRTL?<>متجر <span style={{background:"linear-gradient(135deg,#e821a0,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>متكامل</span></>:<><span style={{background:"linear-gradient(135deg,#e821a0,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Tout</span> en un seul endroit</>}
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1.5rem"}}>
            {[
              {emoji:"💻",color:"#e821a0",fr:"Vente",ar:"بيع الأجهزة",dfr:"Neufs & reconditionnés, toutes marques",dar:"جديدة ومستعملة من كبرى الماركات"},
              {emoji:"🔧",color:"#a855f7",fr:"Maintenance",ar:"الصيانة",dfr:"Diagnostic et réparation rapide",dar:"تشخيص وإصلاح جميع الأعطال"},
              {emoji:"🎧",color:"#22d3ee",fr:"Accessoires",ar:"الملحقات",dfr:"Souris, claviers, sacoches et plus",dar:"فأرة، لوحة مفاتيح، حقائب وأكثر"},
              {emoji:"🚚",color:"#4ade80",fr:"Livraison",ar:"التوصيل",dfr:"Livraison dans 68 wilayas d'Algérie",dar:"توصيل لـ 68 ولاية في الجزائر"},
              {emoji:"💬",color:"#fb923c",fr:"Support",ar:"الدعم",dfr:"Aide par WhatsApp & suivi en temps réel",dar:"دعم على واتساب وتتبع الطلبات"},
              {emoji:"🛡️",color:"#facc15",fr:"Garantie",ar:"الضمان",dfr:"Garantie sur tous les appareils vendus",dar:"ضمان على جميع الأجهزة المباعة"},
            ].map(s=>(
              <div key={s.fr}
                style={{padding:"1.75rem 1.5rem",background:"rgba(255,255,255,0.03)",border:`1px solid ${s.color}22`,borderRadius:"20px",transition:"all 0.3s",cursor:"default"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background=`${s.color}10`;el.style.borderColor=`${s.color}45`;el.style.transform="translateY(-4px)";el.style.boxShadow=`0 16px 40px ${s.color}20`;}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background="rgba(255,255,255,0.03)";el.style.borderColor=`${s.color}22`;el.style.transform="";el.style.boxShadow="";}}
              >
                <div style={{width:"48px",height:"48px",borderRadius:"14px",background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:"1rem"}}>{s.emoji}</div>
                <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"0.5rem",color:"var(--text)"}}>{isRTL?s.ar:s.fr}</div>
                <div style={{fontSize:"0.82rem",color:"var(--text-muted)",lineHeight:1.55}}>{isRTL?s.dar:s.dfr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STORE PHOTO ════════════════════════════════════ */}
      <section style={{padding:"0 1.5rem 5rem"}}>
        <div style={{maxWidth:"960px",margin:"0 auto",borderRadius:"28px",overflow:"hidden",position:"relative",border:"1px solid rgba(232,33,160,0.2)",boxShadow:"0 24px 60px rgba(0,0,0,0.4)"}}>
          <img src="/store-photo.jpg" alt="Boutique ROC DZ" style={{width:"100%",display:"block",height:"auto",maxHeight:"440px",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"2rem",left:isRTL?"auto":"2rem",right:isRTL?"2rem":"auto"}}>
            <div style={{display:"inline-block",padding:"3px 12px",borderRadius:"999px",background:"rgba(232,33,160,0.25)",border:"1px solid rgba(232,33,160,0.5)",color:"var(--pink)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:"0.75rem"}}>
              {isRTL?"متجرنا الفيزيائي":"Boutique physique"}
            </div>
            <h3 style={{color:"white",fontWeight:900,fontSize:"clamp(1.3rem,3vw,1.9rem)",marginBottom:"0.3rem",textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>ROC DZ — Notre boutique</h3>
            <p style={{color:"rgba(255,255,255,0.7)",fontSize:"0.88rem"}}>VENTE / ACHAT · MAINTENANCE · ACCESSOIRES · LAPTOPS</p>
          </div>
        </div>
      </section>

      {/* ══ CONTACT CARDS ══════════════════════════════════ */}
      <section style={{padding:"0 1.5rem 5rem"}}>
        <div style={{maxWidth:"960px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.7rem",letterSpacing:"3px",textTransform:"uppercase",color:"var(--pink)",fontWeight:700,marginBottom:"0.5rem"}}>{isRTL?"تواصل معنا":"Nous contacter"}</div>
            <h2 style={{fontSize:"clamp(1.4rem,3vw,2.2rem)",fontWeight:900,color:"var(--text)"}}>{isRTL?"نحن هنا من أجلك":"On est là pour vous"}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1.25rem"}}>

            {/* Horaires */}
            <div style={{padding:"1.75rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"1rem"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"rgba(232,33,160,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><Clock size={18} style={{color:"var(--pink)"}}/></div>
                <span style={{fontWeight:700,fontSize:"0.8rem",color:"var(--pink)",textTransform:"uppercase",letterSpacing:"1.5px"}}>{isRTL?"ساعات العمل":"Horaires"}</span>
              </div>
              <p style={{fontWeight:800,fontSize:"1.05rem",color:"var(--text)"}}>6/7 jours</p>
              <p style={{fontWeight:600,fontSize:"0.95rem",color:"var(--text-muted)",marginTop:"2px"}}>9h → 20h</p>
            </div>

            {/* Téléphones */}
            <div style={{padding:"1.75rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"1rem"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"rgba(232,33,160,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><Phone size={18} style={{color:"var(--pink)"}}/></div>
                <span style={{fontWeight:700,fontSize:"0.8rem",color:"var(--pink)",textTransform:"uppercase",letterSpacing:"1.5px"}}>{isRTL?"اتصل بنا":"Contact"}</span>
              </div>
              <a href="tel:0562854820" style={{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",color:"var(--text)",fontWeight:700,fontSize:"0.95rem",marginBottom:"0.6rem"}}>
                📞 0562 854 820 <span style={{fontSize:"0.72rem",color:"var(--text-muted)",fontWeight:400}}>8h – 16h</span>
              </a>
              <a href="tel:0553207730" style={{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",color:"var(--text)",fontWeight:700,fontSize:"0.95rem"}}>
                📞 0553 207 730 <span style={{fontSize:"0.72rem",color:"var(--text-muted)",fontWeight:400}}>16h – minuit</span>
              </a>
            </div>

            {/* Localisation + réseaux */}
            <div style={{padding:"1.75rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"1rem"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"rgba(232,33,160,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><MapPin size={18} style={{color:"var(--pink)"}}/></div>
                <span style={{fontWeight:700,fontSize:"0.8rem",color:"var(--pink)",textTransform:"uppercase",letterSpacing:"1.5px"}}>{isRTL?"الموقع":"Localisation"}</span>
              </div>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:"6px",textDecoration:"none",color:"var(--text)",fontWeight:700,fontSize:"0.9rem",marginBottom:"1rem"}}>
                📍 {isRTL?"اعرض على الخريطة":"Voir sur Google Maps"}
              </a>
              <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{color:"#e1306c",textDecoration:"none",display:"flex",transition:"transform 0.2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="scale(1.2)";}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="";}}><Instagram size={22}/></a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" style={{color:"#1877f2",textDecoration:"none",display:"flex",transition:"transform 0.2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="scale(1.2)";}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="";}}><Facebook size={22}/></a>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={{color:"#ff0000",textDecoration:"none",display:"flex",transition:"transform 0.2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="scale(1.2)";}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.transform="";}}><Youtube size={22}/></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY US ═════════════════════════════════════════ */}
      <section style={{padding:"0 1.5rem 6rem"}}>
        <div style={{maxWidth:"960px",margin:"0 auto",borderRadius:"24px",padding:"2.5rem",background:"linear-gradient(135deg,rgba(232,33,160,0.07),rgba(139,59,221,0.07))",border:"1px solid rgba(232,33,160,0.2)"}}>
          <h2 style={{fontSize:"clamp(1.3rem,3vw,1.9rem)",fontWeight:900,marginBottom:"2rem",color:"var(--text)"}}>{a.whyTitle}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"1rem"}}>
            {(a.reasons as readonly string[]).map((reason,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
                <span style={{width:"22px",height:"22px",borderRadius:"50%",background:"rgba(232,33,160,0.15)",border:"1px solid rgba(232,33,160,0.35)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"0.68rem",color:"var(--pink)",marginTop:"1px",fontWeight:900}}>✓</span>
                <span style={{fontSize:"0.88rem",color:"var(--text-muted)",lineHeight:1.6}}>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
