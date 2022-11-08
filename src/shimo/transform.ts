type docResponse = {
  Values: any[];
}

export async function getTitle(title: any[], suffix: string) {
  var title: any[] = [];

  title.map((value, index) => {
    if (!!value) {
      title[index] = value.split(suffix)[0].toLowerCase();
    } else {
      title[index] = "";
    }
  })

  return title;
}

export async function obj2Map(doc: docResponse, title: string[]) {
  var result = new Map();

  for (var i = 1; i < doc.Values.length; i++) {
    var r = new Map();
    for (var j = 0; j < title.length; j++) {
      r.set(title[j], doc.Values[i][j]);
    }
    result.set(doc.Values[i][0], r);
  }

  return result;
}

export async function removeEmpty(data: any, title: string[]) {
  var empty: boolean;

  var tmpRow = new Map();

  data.forEach((row: any, index: any) => {
    empty = true;
    row.forEach((value: any) => {
      if (!!value) {
        empty = false;
        return;
      }
    })
    if (!empty) {
      tmpRow.set(index, row);
    }
  })

  var delCol = new Map();
  title.forEach((value, index) => {
    empty = true;
    tmpRow.forEach((row) => {
      if (!!row.get(value)) {
        empty = false;
        return;
      }
    })
    if (empty) {
      delCol.set(index, value);
    }
  })

  var result = new Map();
  tmpRow.forEach((row, index) => {
    var tmp = row;
    delCol.forEach((value) => {
      tmp.delete(value);
    })
    result.set(index, tmp);
  })

  return result;
}

export async function Transform(data: any, suffix: string) {
  var doc: docResponse = data;
  if (doc.Values.length == 0) {
    return null;
  }

  var title = await getTitle(doc.Values[0], suffix);
  var rmap = await obj2Map(doc, title);
  var result = await removeEmpty(rmap, title);

  return result;
}