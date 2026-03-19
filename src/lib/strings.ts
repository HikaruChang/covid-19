function isNull(o: unknown): o is null | undefined | '' {
  return o === '' || o === null || o === undefined;
}

export interface Contact {
  name: string;
  content: string;
  link: { href: string; target?: string } | null;
}

function formatContact(
  name: string | null | undefined,
  content: string | null | undefined,
): Contact | null {
  if (isNull(name) && isNull(content)) return null;
  return {
    name: `负责人：${!isNull(name) ? name : '(姓名未知)'}`,
    content: `电话：${!isNull(content) ? content : '(电话未知)'}`,
    link: content ? { href: `tel://${content}` } : null,
  };
}

function split(str: string | null | undefined, delimiter: string): string[] {
  if (isNull(str)) return [];
  if (typeof str !== 'string') return [str as string];
  return str.split(delimiter);
}

export function contacts(
  name: string | null | undefined,
  content: string | null | undefined,
  delimiter = ' ',
): Contact[] {
  const results: Contact[] = [];
  const names = split(name, delimiter);
  const contents = split(content, delimiter);

  if (names.length === contents.length && names.length) {
    for (let i = 0; i < names.length; i++) {
      const f = formatContact(names[i], contents[i]);
      if (f) results.push(f);
    }
  } else {
    const f = formatContact(name, content);
    if (f) results.push(f);
  }
  return results;
}

export function trueness(str: string | null | undefined): {
  t: boolean;
  r: string;
} {
  if (!str) return { t: false, r: '' };
  const parts = str.split('\n');
  if (parts.length === 2) return { t: parts[0] === '是', r: parts[1] };
  return { t: false, r: '' };
}
