// Importing constants
import commonConstant from '../constants/common.constant';

export const getSkillTrackSignature = (cookies: string) => {
  const skillTrackSignature = cookies
    .split(';')
    .find((cookie: any) => cookie.trim().startsWith(commonConstant.signatureCookieName));
  return skillTrackSignature ? skillTrackSignature.split('=')[1] : null;
};

export default {
  getSkillTrackSignature
};
