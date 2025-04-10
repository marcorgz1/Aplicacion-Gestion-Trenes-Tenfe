const steps = [
  "Selecciona tu viaje",
  "Introduce tus datos",
  "Personaliza tu viaje",
  "Compra",
  "Confirmación",
]

const baseStyle = "flex-1 text-center rounded-md px-4 py-2 text-sm font-medium transition duration-200";
  const doneStyle = "bg-green-600 text-white line-through";
  const currentStyle = "bg-green-400 text-black";
  const inactiveStyle = "text-gray-700 bg-green-200";

export function Wizard({ inStep = 0 }) {

  return (

    <div className="min-h-full m-4">
      <nav>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">  
          <div className="flex items-baseline justify-between gap-12 relative">
            {steps.map((stepLabel, index) => (
              <div key={index} className="flex items-center relative z-10">
                <span key={index}
                      className={`${baseStyle} ${index === inStep ? currentStyle : index < inStep ? doneStyle : inactiveStyle}`}> {stepLabel}
                </span>                
              </div>
            ))}
            {/* Línea de progreso */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-green-200 rounded-md z-0">
              <div className={`h-full bg-green-600 rounded-md transition-all duration-500 ease-in-out`}
                   style={{
                     width: `${(inStep / (steps.length - 1)) * 100}%`,
                   }}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
