"Use Client"
import MenuPelea from "@/components/MenuPelea";

export default function Home() {
  return (
    <main className="contenedor"> 
      <h1>Combat Pio</h1>
      <MenuPelea
        ataques={['Placaje', 'Lanzallamas', 'Hidrobomba', 'Impactrueno']}
        probabilidadEsquivar={35} className="menu"
      />
    </main>
  );
}
