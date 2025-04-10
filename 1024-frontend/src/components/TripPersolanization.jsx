import { FaBicycle, FaDog, FaSuitcaseRolling, FaWheelchair } from "react-icons/fa";

const [selectedExtras, setSelectedExtras] = useState([]);

const extras = [
    { name: "Bicicleta", description: "Lleve su bicicleta en su viaje", price: "20€", icon: <FaBicycle size={24} /> },
    { name: "Mascota", description: "Viaje con su mascota", price: "25€", icon: <FaDog size={24} /> },
    { name: "Equipaje Extra", description: "Lleve equipaje extra", price: "30€", icon: <FaSuitcaseRolling size={24} /> },
    { name: "Asistencia Especial", description: "Adaptado a personas con movilidad reducida", price: "35€", icon: <FaWheelchair size={24} /> }
];

const toggleExtra = (extraName) => {
  setSelectedExtras((prev) =>
      prev.includes(extraName)
          ? prev.filter((item) => item !== extraName)
          : [...prev, extraName]
  );
}

<div className="grid grid-cols-2 gap-4 w-[50%] mx-auto">
  {extras.map((extra, index) => (
    <button
        key={index}
        onClick={() => toggleExtra(extra.name)}
        className={`p-4 rounded-lg shadow-md text-center text-lg font-semibold transition-all flex flex-col items-center gap-2
            ${selectedExtras.includes(extra.name) ? "bg-black border-[#3a9956] border-2 text-[#3a9956]" : "bg-white border-black border-2 text-black"}`}
    >
      {extra.icon}
      <span>{extra.name}</span>
      <span className={`${selectedExtras.includes(extra.name) ? " text-[#3a9956]" : " text-black"}`}>
        {extra.description}
      </span>
      <span className={`${selectedExtras.includes(extra.name) ? " text-[#3a9956]" : " text-black"}`}>
        {extra.price}
      </span>
    </button>
  ))}
</div>