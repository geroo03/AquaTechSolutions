import React, { useState } from 'react';
import { PHONE_NUMBER } from '../data/mockData';

interface QuoteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialService,
}) => {
  const [surfaceType, setSurfaceType] = useState<string>(initialService || 'Losa de hormigón plana');
  const [area, setArea] = useState<number>(85);
  const [condition, setCondition] = useState<string>('Gotera activa con filtración');
  const [zone, setZone] = useState<string>('Córdoba Capital');
  const [hasOldMembrane, setHasOldMembrane] = useState<boolean>(true);

  if (!isOpen) return null;

  // Calculation logic based on Córdoba industry standards
  let recommendedSystem = 'Membrana Asfáltica 4mm Geotextil + Sellador Poliuretánico';
  let warrantyYears = 10;
  let estimatedDays = Math.max(2, Math.ceil(area / 45) + (hasOldMembrane ? 1 : 0));
  let basePricePerM2 = 28000; // Reference ARS per m² for materials + labor

  if (surfaceType.includes('Terraza transitable')) {
    recommendedSystem = 'Membrana Líquida Poliuretánica Transitable (Tránsito Pesado) + Sellado de Juntas Sikaflex';
    warrantyYears = 7;
    basePricePerM2 = 32000;
  } else if (surfaceType.includes('chapa')) {
    recommendedSystem = 'Sellado Elastomérico Térmico + Tornillería con Arandela EPDM + Zinguería perimetral';
    warrantyYears = 7;
    basePricePerM2 = 22000;
  } else if (surfaceType.includes('tejas')) {
    recommendedSystem = 'Recolocación de tejas rotas + Mortero hidrófugo elástico + Hidrorrepelente siliconado profundo';
    warrantyYears = 5;
    basePricePerM2 = 26000;
  } else if (surfaceType.includes('Cimientos')) {
    recommendedSystem = 'Inyección de microemulsión de siloxanos a presión (Barrera química continua)';
    warrantyYears = 10;
    basePricePerM2 = 38000;
  } else if (surfaceType.includes('Tanque')) {
    recommendedSystem = 'Mortero bicomponente polimérico de grado sanitario apto para agua potable (IRAM)';
    warrantyYears = 7;
    basePricePerM2 = 34000;
  }

  const minTotal = Math.round((area * basePricePerM2 * 0.9) / 1000) * 1000;
  const maxTotal = Math.round((area * basePricePerM2 * 1.15) / 1000) * 1000;

  const formatCurrency = (val: number) => {
    return '$' + val.toLocaleString('es-AR');
  };

  const whatsappMessage = `Hola AquaTech! Estuve calculando en su cotizador online:
- Superficie: ${surfaceType} (${area} m²)
- Estado: ${condition}
- Membrana previa: ${hasOldMembrane ? 'Sí, tiene capa vieja' : 'No'}
- Zona: ${zone}
- Sistema sugerido: ${recommendedSystem} (${warrantyYears} años de garantía)
Quisiera coordinar una visita técnica para validar este presupuesto.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] flex items-center justify-center transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0] mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#cde5ff] text-[#006399] flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">calculate</span>
          </div>
          <div>
            <h3 className="font-['Montserrat',sans-serif] text-xl sm:text-2xl font-bold text-[#00263f]">
              Cotizador Online de Impermeabilización
            </h3>
            <p className="text-xs text-[#64748b]">
              Cálculo técnico preliminar para Córdoba y Gran Córdoba sin costo ni compromiso.
            </p>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="space-y-5 mb-6">
          {/* Surface Type */}
          <div>
            <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-2">
              1. Tipo de superficie o cubierta
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Losa de hormigón plana',
                'Terraza transitable',
                'Techo de chapa / galpón',
                'Techo de tejas coloniales',
                'Cimientos (humedad ascendente)',
                'Tanque o pileta de agua',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSurfaceType(type)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                    surfaceType === type
                      ? 'bg-[#00263f] text-white border-[#00263f] shadow-xs'
                      : 'bg-[#f8fafc] text-[#334155] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Area Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#00263f] uppercase tracking-wider">
                2. Superficie aproximada a impermeabilizar
              </label>
              <span className="text-base font-extrabold text-[#006399] bg-[#e0f2fe] px-3 py-1 rounded-lg">
                {area} m²
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="400"
              step="5"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#006399]"
            />
            <div className="flex justify-between text-[11px] text-[#64748b] mt-1">
              <span>15 m² (Balcón pequeño)</span>
              <span>80 m² (Vivienda promedio)</span>
              <span>200 m² (Casa grande)</span>
              <span>400 m² (Edificio)</span>
            </div>
          </div>

          {/* State / Urgency & Old Membrane */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-1.5">
                3. Estado actual del problema
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] bg-white outline-none focus:border-[#4cb2ff]"
              >
                <option value="Gotera activa con filtración">Gotera activa con filtración en lluvias</option>
                <option value="Humedad y manchas en cielorraso">Humedad y manchas en cielorraso</option>
                <option value="Membrana vieja resquebrajada">Membrana vieja resquebrajada / desprendida</option>
                <option value="Mantenimiento preventivo">Mantenimiento preventivo antes de lluvias</option>
                <option value="Obra en construcción nueva">Obra en construcción nueva</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-1.5">
                4. Ubicación en Córdoba
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] bg-white outline-none focus:border-[#4cb2ff]"
              >
                <option value="Córdoba Capital">Córdoba Capital</option>
                <option value="Villa Allende">Villa Allende</option>
                <option value="Mendiolaza">Mendiolaza</option>
                <option value="Río Ceballos">Río Ceballos</option>
                <option value="Villa Carlos Paz">Villa Carlos Paz</option>
                <option value="Malagueño">Malagueño</option>
                <option value="La Calera">La Calera</option>
                <option value="Alta Gracia">Alta Gracia</option>
                <option value="Otra localidad de Córdoba">Otra localidad de Córdoba</option>
              </select>
            </div>
          </div>

          {/* Checkbox for removal */}
          <label className="flex items-center gap-2 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer">
            <input
              type="checkbox"
              checked={hasOldMembrane}
              onChange={(e) => setHasOldMembrane(e.target.checked)}
              className="w-4 h-4 rounded text-[#006399] accent-[#006399]"
            />
            <span className="text-xs text-[#334155] font-medium">
              Hay una membrana previa deteriorada que requiere raspado y remoción completa
            </span>
          </label>
        </div>

        {/* Calculated Result Box */}
        <div className="p-5 rounded-2xl bg-[#00263f] text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="text-xs font-bold text-[#cde5ff] uppercase tracking-wider">
              Diagnóstico & Solución Recomendada
            </span>
            <span className="text-xs font-bold text-[#4cb2ff] bg-white/10 px-2.5 py-0.5 rounded-md">
              Garantía {warrantyYears} Años Escrita
            </span>
          </div>

          <div className="text-sm sm:text-base font-bold text-white mb-2">
            {recommendedSystem}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#cde5ff] mt-4 pt-3 border-t border-white/10">
            <div>
              <span className="text-[#7fa7cd] block">Tiempo estimado:</span>
              <span className="font-bold text-white">{estimatedDays} jornadas de trabajo</span>
            </div>
            <div>
              <span className="text-[#7fa7cd] block">Rango aproximado:</span>
              <span className="font-extrabold text-[#4cb2ff]">
                {formatCurrency(minTotal)} – {formatCurrency(maxTotal)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#7fa7cd] block">Visita técnica in situ:</span>
              <span className="font-bold text-[#00bb56]">100% Gratuita</span>
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex-1 inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Enviar esta cotización por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3.5 text-xs font-semibold text-[#64748b] hover:text-[#00263f] rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
