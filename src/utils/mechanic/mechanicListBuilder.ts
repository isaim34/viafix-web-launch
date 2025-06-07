
import { MechanicProfile } from '@/hooks/useMechanics';

export const buildMechanicsList = (
  mechanics: MechanicProfile[]
): MechanicProfile[] => {
  // Simply return mechanics from database - no local profiles needed
  return mechanics;
};
