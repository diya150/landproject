import { Chhattisgarh2DMap } from '../components/Chhattisgarh2DMap';

export function Chhattisgarh() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chhattisgarh Industrial Land Monitoring</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive geographic visualization of industrial land parcels, compliance status, and spatial distribution across Chhattisgarh state sectors.
        </p>
      </div>
      
      <Chhattisgarh2DMap />
    </div>
  );
}
