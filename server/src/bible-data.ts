/**
 * Bible Data - Portuguese verses
 * Simplified dataset for demonstration
 */

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const bibleData: Record<string, Verse[]> = {
  "João": [
    {
      book: "João",
      chapter: 3,
      verse: 16,
      text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
    },
    {
      book: "João",
      chapter: 14,
      verse: 6,
      text: "Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim."
    }
  ],
  "Salmos": [
    {
      book: "Salmos",
      chapter: 23,
      verse: 1,
      text: "O Senhor é o meu pastor, nada me faltará."
    },
    {
      book: "Salmos",
      chapter: 119,
      verse: 105,
      text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
    },
    {
      book: "Salmos",
      chapter: 46,
      verse: 1,
      text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia."
    }
  ],
  "Provérbios": [
    {
      book: "Provérbios",
      chapter: 3,
      verse: 5,
      text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento."
    },
    {
      book: "Provérbios",
      chapter: 3,
      verse: 6,
      text: "Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas."
    }
  ],
  "Mateus": [
    {
      book: "Mateus",
      chapter: 11,
      verse: 28,
      text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei."
    },
    {
      book: "Mateus",
      chapter: 6,
      verse: 33,
      text: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas."
    }
  ],
  "Filipenses": [
    {
      book: "Filipenses",
      chapter: 4,
      verse: 13,
      text: "Posso todas as coisas naquele que me fortalece."
    },
    {
      book: "Filipenses",
      chapter: 4,
      verse: 6,
      text: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças."
    }
  ],
  "Romanos": [
    {
      book: "Romanos",
      chapter: 8,
      verse: 28,
      text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito."
    },
    {
      book: "Romanos",
      chapter: 12,
      verse: 2,
      text: "E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus."
    }
  ]
};

export function getAllBooks(): string[] {
  return Object.keys(bibleData);
}

export function getRandomVerse(): Verse {
  const books = getAllBooks();
  const randomBook = books[Math.floor(Math.random() * books.length)];
  const verses = bibleData[randomBook];
  return verses[Math.floor(Math.random() * verses.length)];
}

export function getVerseFromBook(bookName: string): Verse | null {
  const normalizedBook = bookName.trim();
  const verses = bibleData[normalizedBook];
  
  if (!verses || verses.length === 0) {
    return null;
  }
  
  return verses[Math.floor(Math.random() * verses.length)];
}

export function formatVerse(verse: Verse): string {
  return `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;
}
