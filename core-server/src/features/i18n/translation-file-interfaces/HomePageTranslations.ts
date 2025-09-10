export default interface HomePageTranslations {
  smallAnnouncement: string;
  disclaimer: string;
  intro: {
    sloganPre: string;
    sloganPost: string;
    teaserPre: string;
    teaserStripedThrough: string;
    teaserActual: string;
    playButton: string;    
  };
  playingGuessGrid: {
    guesses: string[],
    actualWord: string,
  }
  notFound: {
    title: string;
    description: string;
    btnText: string;
  }
}