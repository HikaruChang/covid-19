type docResponse = {
  Values: any[];
}

export async function getTitle(title: any[], suffix: string) {
  var title = [];

  title.map((value, index) => {
    if (!!value) {
      title[index] = value.split(suffix)[0].toLowerCase();
    } else {
      title[index] = "";
    }
  })

  return title;
}

export async function Transform(data: any[], suffix: string) {
  if (data.length === 0) {
    return []
  }


}