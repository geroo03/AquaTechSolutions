import React from 'react';
import { Printer } from 'lucide-react';
import { CERTIFICATE_DATA } from '../data/mockData';
import { Logo, WhatsAppIcon } from './Brand';
import { Modal, waLink } from './ui';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} label="Certificado de garantía modelo">
      <div className="p-7 sm:p-10">
        <div className="flex items-start justify-between gap-4 pb-7 mb-8 border-b-2 border-ink pr-10">
          <Logo />
          <div className="hidden sm:block text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Certificado</div>
            <div className="font-mono text-sm font-bold text-ink">{CERTIFICATE_DATA.policyNumber}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-mist text-[10.5px] font-semibold uppercase tracking-[0.22em] text-graphite mb-4">
            Documento modelo
          </span>
          <h3 className="font-headline text-2xl sm:text-3xl font-bold text-ink">Certificado de garantía</h3>
          <p className="text-sm text-muted mt-2">Se entrega firmado al terminar cada obra.</p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-2xl overflow-hidden bg-line ring-1 ring-line mb-6">
          {[
            ['Dirección técnica', CERTIFICATE_DATA.technicalDirector],
            ['Normativa', CERTIFICATE_DATA.standards],
            ['Ensayo', CERTIFICATE_DATA.watertightTest],
            ['Plazo de cobertura', CERTIFICATE_DATA.coveragePeriod],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-5">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</dt>
              <dd className="mt-1.5 text-sm font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="text-[13px] text-graphite leading-relaxed p-5 rounded-2xl bg-paper mb-8">
          <strong className="text-ink">Qué cubre:</strong> desprendimientos, defectos de adhesión, rotura de la membrana
          por dilatación térmica y filtraciones en juntas selladas. Si aparece un problema dentro del plazo, el equipo
          de AquaTech lo revisa y lo resuelve sin costo para el cliente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waLink('Hola AquaTech, quiero consultar por los términos de la garantía escrita')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
          >
            <WhatsAppIcon size={17} /> Consultar términos
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full ring-1 ring-line text-sm font-semibold text-ink hover:bg-mist transition-colors"
          >
            <Printer size={16} strokeWidth={1.8} /> Imprimir
          </button>
        </div>
      </div>
    </Modal>
  );
};
