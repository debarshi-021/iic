// UID SCHEMA FORMAT: IR<YY>-Z<ZZZ>-V<VVV>-B<BBB>-<SSSSSS>
const UID_REGEX =
  /^IR(\d{2})-Z(0(0[1-9]|1[0-8]))-V(00[1-8])-B(0[0-9][0-9]|[1-9][0-9][0-9])-([0-9]{6})$/;

export function validateUID(uid: string) {
  const match = uid.trim().match(UID_REGEX);
  if (!match) return null;
  return {
    year: match[1],
    zone: match[2],
    vendor: match[3],
    batch: match[4],
    serial: match[5],
  };
}