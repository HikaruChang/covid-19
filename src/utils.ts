export const HumanString = (s: SubmissionSupply) => {
  return `${s.name}|需求数量:${s.need}${s.unit}|每日消耗:${s.daily}${s.unit}|库存:${s.have}${s.unit}|需求:${s.requirements}`;
}

export const ParseSubmissionSupplyHumanString = (humanString: string) => {
  const fields = humanString.split(ColonSeparator);
  if (fields.length !== 2) {
    return ["", "", ""];
  }
  const part = fields[1];
  const length = part.length;
  if (length < 3) {
    return [part, part, part];
  } else {
    return [part.substring(0, length - 3), part.substring(length - 3), part];
  }
}

export const NewSubmissionSupplyFromShimoDoc = (doc: string): SubmissionSupply => {
  const columns = doc.split(DotSeparator);

  const submissionSupply: SubmissionSupply = {
    name: columns[0],
    need: ParseSubmissionSupplyHumanString(columns[1])[0],
    unit: ParseSubmissionSupplyHumanString(columns[1])[1],
    daily: ParseSubmissionSupplyHumanString(columns[2])[0],
    have: ParseSubmissionSupplyHumanString(columns[3])[0],
    requirements: ParseSubmissionSupplyHumanString(columns[4])[2],
  }

  return submissionSupply;
}

export const RefactSubmissionSupply = (humanString: string) => {
  const supplySlice = new Array<any>();
  const elements = humanString.split(DotSeparator);
  elements.forEach((e) => {
    const submissionSupply = NewSubmissionSupplyFromShimoDoc(e);
    if (!!submissionSupply) {
      supplySlice.push(submissionSupply);
    }
  });
  return supplySlice;
}

export const Values = (c: CommunitySubmission) => {
  const r = [c.name, c.age, c.province, c.city, c.suburb, c.address, c.contractPhone, c.agentName, c.agentContactPhone, c.needsVehicle, c.notes];

  return r;
}

export const JoinSubmissionSupplySlice = (supplySlice: SubmissionSupply[]) => {
  const r = new Array<string>();
  supplySlice.forEach((s) => {
    r.push(HumanString(s));
  });
  return r.join(DotSeparator);
}

export const RefactCommunitySubmissionFromShimoDoc = (doc: Map<string, any>) => {
  doc.forEach((m) => {
    if (!!m.get('medicalSupplies')) {
      m.set('medicalSupplies', RefactSubmissionSupply(m.get('medicalSupplies')));
    }
    if (!!m.get('liveSupplies')) {
      m.set('liveSupplies', RefactSubmissionSupply(m.get('liveSupplies')));
    }
  });

  return doc;
}