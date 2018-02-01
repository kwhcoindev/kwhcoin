import { CmwUiPage } from './app.po';

describe('cmw-ui App', () => {
  let page: CmwUiPage;

  beforeEach(() => {
    page = new CmwUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
