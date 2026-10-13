import React, { useState } from 'react';
import { PHONE_NUMBER } from '../data/mockData';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [problemType, setProblemType] = useState('Gotera activa cuando llueve fuerte');
  const [propertyType, setPropertyType] = useState('Casa particular');
  const [addressArea, setAddressArea] = useState('Córdoba Capital');
  const [urgency, setUrgency] = useState('Esta semana');
  const [hasPhotoAttached, setHasPhotoAttached] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola AquaTech! Les envío datos para un diagnóstico técnico de impermeabilización:
- Problema: ${problemType}
- Tipo de propiedad: ${propertyType}
- Ubicación: ${addressArea}
- Urgencia: ${urgency}
Adjunto a continuación las fotos del techo para que las revise un técnico.`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] p-6 sm:p-8 relative text-[#191c1e]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] flex items-center justify-center transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0] mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#cde5ff] text-[#006399] flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">photo_camera</span>
          </div>
          <div>
            <h3 className="font-['Montserrat',sans-serif] text-xl font-bold text-[#00263f]">
              Diagnóstico Exprés por Fotos
            </h3>
            <p className="text-xs text-[#64748b]">
              Mandanos fotos de tu techo por WhatsApp y te decimos qué sistema conviene.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-1.5">
              ¿Qué problema estás experimentando?
            </label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] bg-white outline-none focus:border-[#4cb2ff]"
            >
              <option value="Gotera activa cuando llueve fuerte">Gotera activa cuando llueve fuerte</option>
              <option value="Manchas de humedad en cielorraso o paredes">Manchas de humedad en cielorraso o paredes</option>
              <option value="Membrana asfáltica vieja levantada o con bolsas de agua">Membrana asfáltica vieja levantada o con bolsas de agua</option>
              <option value="Fisuras visibles en losa o junta de dilatación">Fisuras visibles en losa o junta de dilatación</option>
              <option value="Humedad en zócalos y cimientos (salitre)">Humedad en zócalos y cimientos (salitre)</option>
              <option value="Pérdida de agua en pileta o tanque">Pérdida de agua en pileta o tanque</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-1.5">
                Tipo de inmueble
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] bg-white outline-none focus:border-[#4cb2ff]"
              >
                <option value="Casa particular">Casa particular</option>
                <option value="Dúplex o PH">Dúplex o PH</option>
                <option value="Edificio / Consorcio">Edificio / Consorcio</option>
                <option value="Galpón / Industria">Galpón / Industria</option>
                <option value="Comercio / Oficina">Comercio / Oficina</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-1.5">
                Barrio o localidad
              </label>
              <input
                type="text"
                value={addressArea}
                onChange={(e) => setAddressArea(e.target.value)}
                placeholder="Ej: Cerro, Villa Allende..."
                className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] bg-white outline-none focus:border-[#4cb2ff]"
              />
            </div>
          </div>

          {/* Photo dropzone simulation */}
          <div>
            <label className="block text-xs font-bold text-[#00263f] uppercase tracking-wider mb-1.5">
              Fotos del techo o gotera
            </label>
            <div 
              onClick={() => setHasPhotoAttached(!hasPhotoAttached)}
              className={`p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
                hasPhotoAttached
                  ? 'border-[#00bb56] bg-[#f0fdf4]'
                  : 'border-[#cbd5e1] hover:border-[#006399] bg-[#f8fafc]'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${hasPhotoAttached ? 'text-[#00bb56]' : 'text-[#64748b]'}`}>
                {hasPhotoAttached ? 'check_circle' : 'add_a_photo'}
              </span>
              <p className="text-xs font-bold text-[#0f172a]">
                {hasPhotoAttached ? '¡Listo! Foto lista para enviar por WhatsApp' : 'Tocá acá para seleccionar fotos'}
              </p>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                O bien envialas directamente desde el chat de WhatsApp a nuestro asesor técnico.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>Abrir WhatsApp con diagnóstico</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
