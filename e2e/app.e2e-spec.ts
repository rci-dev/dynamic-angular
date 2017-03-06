import { Dynamic1Page } from './app.po';

describe('dynamic1 App', function() {
  let page: Dynamic1Page;

  beforeEach(() => {
    page = new Dynamic1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
