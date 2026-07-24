import { expect, test, type Locator, type Page } from '@playwright/test';

const homepage = {
  path: '/',
  documentTitle: 'Operational Improvement Portfolio | J. Allekine',
  description:
    'A provisional portfolio presenting operational improvement case studies by J. Allekine.',
} as const;

const caseStudies = [
  {
    path: '/work/workflow-improvement-details-pending/',
    title: 'Workflow improvement case study — details pending',
    documentTitle:
      'Workflow Improvement Case Study — Details Pending | J. Allekine',
    description:
      'A provisional case-study record for a workflow improvement project. Confirmed project facts are pending owner input.',
  },
  {
    path: '/work/spreadsheet-operations-details-pending/',
    title: 'Spreadsheet operations case study — details pending',
    documentTitle:
      'Spreadsheet Operations Case Study — Details Pending | J. Allekine',
    description:
      'A provisional case-study record for a spreadsheet operations project. Confirmed project facts are pending owner input.',
  },
  {
    path: '/work/data-handoff-details-pending/',
    title: 'Data handoff case study — details pending',
    documentTitle:
      'Data Handoff Case Study — Details Pending | J. Allekine',
    description:
      'A provisional case-study record for a data handoff project. Confirmed project facts are pending owner input.',
  },
] as const;

const caseStudyPath = caseStudies[0].path;
const portfolioPages = [homepage, ...caseStudies] as const;

async function openPage(page: Page, path: string) {
  const maximumAttempts = 10;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      await page.goto(path);
      return;
    } catch (error) {
      const previewIsStarting =
        error instanceof Error &&
        (error.message.includes('ERR_CONNECTION_REFUSED') ||
          error.message.includes('ERR_SOCKET_NOT_CONNECTED'));

      if (!previewIsStarting || attempt === maximumAttempts) {
        throw error;
      }

      await page.waitForTimeout(250);
    }
  }
}

async function readElementBoxes(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().toJSON()),
  );
}

async function readBoundingBoxes(...locators: Locator[]) {
  return Promise.all(locators.map((locator) => locator.boundingBox()));
}

test('every page exposes shared landmarks and a working skip link first', async ({
  page,
}) => {
  for (const path of ['/', ...caseStudies.map(({ path }) => path)]) {
    await openPage(page, path);

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    const main = page.getByRole('main');

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toHaveCount(
      1,
    );
    await expect(main).toHaveAttribute('id', 'main-content');
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(
      page.locator(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ).first(),
    ).toHaveAccessibleName('Skip to main content');

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(main).toBeFocused();

    await expect(
      page.locator('.site-identity svg[aria-hidden="true"]'),
    ).toHaveCount(1);
  }
});

test('desktop navigation stays visible while the header scrolls in document flow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await openPage(page, '/');

  const header = page.getByRole('banner');
  const navigation = page.getByRole('navigation', { name: 'Primary' });

  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Work' })).toHaveAttribute(
    'href',
    '/#featured-work',
  );
  await expect(navigation).toContainText(
    'WorkCapabilitiesResumeGitHubContact',
  );
  const mobileMenuButton = page.getByRole('button', {
    name: /navigation/i,
    includeHidden: true,
  });

  await expect(mobileMenuButton).toHaveCount(1);
  await expect(mobileMenuButton).toBeHidden();
  await expect(header).toHaveCSS('position', 'static');

  const initialHeaderBox = await header.boundingBox();

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 900);
  });

  const scrolledHeaderBox = await header.boundingBox();

  expect(initialHeaderBox).not.toBeNull();
  expect(scrolledHeaderBox).not.toBeNull();
  expect(initialHeaderBox!.y).toBe(0);
  expect(scrolledHeaderBox!.y).toBeLessThan(-100);
});

test('mobile navigation expands in flow and closes by button or Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openPage(page, '/');

  const header = page.getByRole('banner');
  const main = page.getByRole('main');
  const navigation = page.getByRole('navigation', {
    name: 'Primary',
    includeHidden: true,
  });
  const menuButton = page.locator('[data-menu-button]');

  await expect(menuButton).toHaveAccessibleName('Open navigation');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAttribute('aria-controls', 'site-navigation');
  await expect(navigation).toBeHidden();

  const collapsedHeaderBox = await header.boundingBox();
  const collapsedMainBox = await main.boundingBox();
  const menuButtonBox = await menuButton.boundingBox();

  expect(collapsedHeaderBox).not.toBeNull();
  expect(collapsedMainBox).not.toBeNull();
  expect(menuButtonBox).not.toBeNull();
  expect(menuButtonBox!.width).toBeGreaterThanOrEqual(44);
  expect(menuButtonBox!.height).toBeGreaterThanOrEqual(44);

  await menuButton.click();

  await expect(menuButton).toHaveAccessibleName('Close navigation');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();

  const expandedHeaderBox = await header.boundingBox();
  const expandedMainBox = await main.boundingBox();

  expect(expandedHeaderBox).not.toBeNull();
  expect(expandedMainBox).not.toBeNull();
  expect(expandedHeaderBox!.height).toBeGreaterThan(collapsedHeaderBox!.height);
  expect(expandedMainBox!.y).toBeGreaterThan(collapsedMainBox!.y);

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();

  await menuButton.click();
  await page.keyboard.press('Escape');

  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();
  await expect(menuButton).toBeFocused();
});

test('identity controls stay readable, focused, and lightweight', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await openPage(page, '/');

  const identityLink = page.getByRole('link', { name: 'J. Allekine' });
  const workLink = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Work' });

  for (const link of [identityLink, workLink]) {
    const box = await link.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(identityLink).toBeFocused();
  await expect(identityLink).toHaveCSS('outline-style', 'solid');

  await expect(page.locator('astro-island')).toHaveCount(0);
  await expect(page.locator('script[type="module"]')).toHaveCount(1);

  const faviconLinks = page.locator('link[rel="icon"]');

  await expect(faviconLinks).toHaveCount(2);
  await expect(faviconLinks.nth(0)).toHaveAttribute('href', '/favicon.svg');
  await expect(faviconLinks.nth(1)).toHaveAttribute('href', '/favicon.ico');

  const svgFavicon = await request.get('/favicon.svg');
  const icoFavicon = await request.get('/favicon.ico');

  expect(svgFavicon.ok()).toBe(true);
  expect(await svgFavicon.text()).toContain('data-faith-signal="cross"');
  expect(icoFavicon.ok()).toBe(true);
  expect(Array.from((await icoFavicon.body()).subarray(0, 4))).toEqual([
    0, 0, 1, 0,
  ]);
});

async function openHomepageContact(page: Page) {
  await openPage(page, '/');
  return page.getByRole('region', { name: 'Contact' });
}

test('a hiring manager can open a featured case study and review its overview', async ({
  page,
}) => {
  await openPage(page, '/');

  await expect(page).toHaveTitle(/Operational Improvement Portfolio/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /operational improvement work/i,
    }),
  ).toBeVisible();

  const featuredWork = page.getByRole('region', { name: 'Featured work' });
  const cards = featuredWork.getByRole('article');
  const firstCard = cards.first();

  await expect(featuredWork.getByRole('list')).toHaveCount(1);
  await expect(featuredWork.getByRole('listitem')).toHaveCount(3);
  await expect(cards).toHaveCount(3);
  await expect(firstCard).toContainText('Project 01');
  await expect(firstCard).toContainText('Category');
  await expect(firstCard).toContainText('Role');
  await expect(firstCard).toContainText('System type');
  await expect(firstCard).toContainText('Year');
  await expect(firstCard).toContainText('Tools');

  await firstCard
    .getByRole('link', { name: /open provisional case study/i })
    .click();

  await expect(page).toHaveURL(caseStudies[0].path);
  await expect(page).toHaveTitle(caseStudies[0].documentTitle);
  await expect(
    page.getByRole('heading', { level: 1, name: caseStudies[0].title }),
  ).toBeVisible();

  const overview = page.getByRole('region', { name: 'Overview' });

  await expect(overview).toContainText(caseStudies[0].title);
  await expect(overview).toContainText(
    'Problem, decisions, and outcome pending owner input.',
  );
  await expect(overview).toContainText('Role');
  await expect(overview).toContainText('Timeline');
  await expect(overview).toContainText('Tools');
  await expect(overview).toContainText('Industry or system type');

  await page.getByRole('link', { name: 'Back to work' }).click();
  await expect(page).toHaveURL(/\/#featured-work$/);
});

test('all three cards open complete case studies with unique metadata', async ({
  page,
}) => {
  await openPage(page, '/');

  const featuredWork = page.getByRole('region', { name: 'Featured work' });
  const cards = featuredWork.getByRole('article');

  await expect(cards).toHaveCount(3);
  await expect(featuredWork.locator('[data-card-artifact]')).toHaveCount(3);

  for (const [index, caseStudy] of caseStudies.entries()) {
    await openPage(page, '/');

    const card = cards.nth(index);
    const link = card.getByRole('link', {
      name: /open provisional case study/i,
    });

    await expect(card).toContainText(`Project 0${index + 1}`);
    await expect(link).toHaveAttribute('href', caseStudy.path);
    await expect(card.locator('[data-card-artifact] img')).toHaveAttribute(
      'alt',
      '',
    );

    await openPage(page, caseStudy.path);
    await expect(page).toHaveTitle(caseStudy.documentTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      caseStudy.description,
    );
    await expect(
      page.getByRole('heading', { level: 1, name: caseStudy.title }),
    ).toBeVisible();
    await expect(page.locator('main h2')).toHaveText([
      'Overview',
      'Problem',
      'Solution',
      'My Contribution',
      'Results',
      'Key Decisions',
      'Project Gallery',
    ]);
  }
});

test('every page shares only metadata backed by centralized values', async ({
  page,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const portfolioPage of portfolioPages) {
    await openPage(page, portfolioPage.path);

    await expect(page).toHaveTitle(portfolioPage.documentTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      portfolioPage.description,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website',
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      portfolioPage.documentTitle,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute('content', portfolioPage.description);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      portfolioPage.documentTitle,
    );
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute('content', portfolioPage.description);

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(0);

    titles.add(await page.title());
    descriptions.add(
      (await page
        .locator('meta[name="description"]')
        .getAttribute('content')) ?? '',
    );
  }

  expect(titles.size).toBe(portfolioPages.length);
  expect(descriptions.size).toBe(portfolioPages.length);
});

test('project navigation is predictable and does not wrap around', async ({
  page,
}) => {
  const expectedEdges = [
    {
      previous: undefined,
      next: caseStudies[1],
    },
    {
      previous: caseStudies[0],
      next: caseStudies[2],
    },
    {
      previous: caseStudies[1],
      next: undefined,
    },
  ] as const;

  for (const [index, caseStudy] of caseStudies.entries()) {
    await openPage(page, caseStudy.path);

    const navigation = page.getByRole('navigation', {
      name: 'Case study projects',
    });
    const previousLink = navigation.getByRole('link', {
      name: /previous project/i,
    });
    const nextLink = navigation.getByRole('link', { name: /next project/i });
    const edge = expectedEdges[index];

    if (edge.previous) {
      await expect(previousLink).toHaveAttribute('href', edge.previous.path);
      await expect(previousLink).toContainText(edge.previous.title);
    } else {
      await expect(previousLink).toHaveCount(0);
    }

    if (edge.next) {
      await expect(nextLink).toHaveAttribute('href', edge.next.path);
      await expect(nextLink).toContainText(edge.next.title);
    } else {
      await expect(nextLink).toHaveCount(0);
    }
  }
});

test('a hiring manager can follow the complete case study in evidence order', async ({
  page,
}) => {
  await openPage(page, caseStudyPath);

  const sectionHeadings = page.locator('main h2');

  await expect(sectionHeadings).toHaveText([
    'Overview',
    'Problem',
    'Solution',
    'My Contribution',
    'Results',
    'Key Decisions',
    'Project Gallery',
  ]);

  const overview = page.getByRole('region', { name: 'Overview' });

  await expect(overview.locator('dl > div')).toHaveCount(6);
  await expect(overview).toContainText('Title');
  await expect(overview).toContainText('Summary');
  await expect(overview).toContainText('Role');
  await expect(overview).toContainText('Timeline');
  await expect(overview).toContainText('Tools');
  await expect(overview).toContainText('Industry or system type');

  const problem = page.getByRole('region', { name: 'Problem' });

  await expect(problem.locator(':scope > p')).toHaveCount(1);
  await expect(problem.locator('ul > li')).toHaveCount(3);
  await expect(problem).toContainText('What was happening');
  await expect(problem).toContainText('Who was affected');
  await expect(problem).toContainText('Why it mattered');
});

test('the solution explains an ordered workflow with one distinct primary visual', async ({
  page,
}) => {
  await openPage(page, caseStudyPath);

  const solution = page.getByRole('region', { name: 'Solution' });
  const workflowSteps = solution.locator('ol > li');
  const primaryFigure = solution.locator('figure');

  await expect(workflowSteps).toHaveCount(3);
  await expect(primaryFigure).toHaveCount(1);
  await expect(primaryFigure.locator('img')).toHaveAttribute('alt', /\S+/);
  await expect(primaryFigure.locator('figcaption')).not.toBeEmpty();

  const contribution = page.getByRole('region', { name: 'My Contribution' });
  const contributions = contribution.locator('li');

  await expect(contributions).toHaveCount(3);
  await expect(contributions.nth(0)).toContainText(/^Document/);
  await expect(contributions.nth(1)).toContainText(/^Identify/);
  await expect(contributions.nth(2)).toContainText(/^Separate/);

  const gallerySources = await page
    .getByRole('region', { name: 'Project Gallery' })
    .locator('img')
    .evaluateAll((images) => images.map((image) => image.getAttribute('src')));
  const primarySource = await primaryFigure.locator('img').getAttribute('src');

  expect(gallerySources).not.toContain(primarySource);
});

test('project media reserves space and uses intentional loading behavior', async ({
  page,
}) => {
  await openPage(page, '/');

  const cardImages = page.locator('[data-card-artifact] img');

  await expect(cardImages).toHaveCount(3);

  for (const cardImage of await cardImages.all()) {
    await expect(cardImage).toHaveAttribute('alt', '');
    await expect(cardImage).toHaveAttribute('width', /^[1-9]\d*$/);
    await expect(cardImage).toHaveAttribute('height', /^[1-9]\d*$/);
    await expect(cardImage).toHaveAttribute('loading', 'lazy');
  }

  for (const caseStudy of caseStudies) {
    await openPage(page, caseStudy.path);

    const solution = page.getByRole('region', { name: 'Solution' });
    const primaryFigure = solution.locator('figure');
    const primaryImage = primaryFigure.locator('img');
    const gallery = page.getByRole('region', { name: 'Project Gallery' });
    const galleryFigures = gallery.locator('figure');
    const galleryImages = galleryFigures.locator('img');

    await expect(primaryImage).toHaveAttribute('alt', /\S+/);
    await expect(primaryImage).toHaveAttribute('loading', 'eager');
    await expect(primaryImage).toHaveAttribute('fetchpriority', 'high');
    await expect(primaryFigure.locator('figcaption')).not.toBeEmpty();

    await expect(galleryImages).toHaveCount(3);

    for (const galleryFigure of await galleryFigures.all()) {
      await expect(galleryFigure.locator('img')).toHaveAttribute('alt', /\S+/);
      await expect(galleryFigure.locator('img')).toHaveAttribute(
        'loading',
        'lazy',
      );
      await expect(galleryFigure.locator('figcaption')).not.toBeEmpty();
    }

    const images = page.locator('main img');
    const imageReservations = await images.evaluateAll((elements) =>
      elements.map((element) => {
        const image = element as HTMLImageElement;

        return {
          width: image.getAttribute('width'),
          height: image.getAttribute('height'),
          aspectRatio: getComputedStyle(image).aspectRatio,
        };
      }),
    );

    expect(imageReservations).toHaveLength(4);

    for (const reservation of imageReservations) {
      expect(Number(reservation.width)).toBeGreaterThan(0);
      expect(Number(reservation.height)).toBeGreaterThan(0);
      expect(reservation.aspectRatio).not.toBe('auto');
    }

    const primarySource = await primaryImage.getAttribute('src');
    const gallerySources = await galleryImages.evaluateAll((images) =>
      images.map((image) => image.getAttribute('src')),
    );

    expect(gallerySources).not.toContain(primarySource);
  }
});

test('results remain honest and key decisions expose reasoning and trade-offs', async ({
  page,
}) => {
  await openPage(page, caseStudyPath);

  const results = page.getByRole('region', { name: 'Results' });

  await expect(results).toContainText('Verified measurements');
  await expect(results).toContainText('None supplied');
  await expect(results).toContainText('Qualitative observation');
  await expect(results).toContainText('Not a measured metric');
  await expect(results).toContainText('Before');
  await expect(results).toContainText('After');

  const decisions = page
    .getByRole('region', { name: 'Key Decisions' })
    .getByRole('article');

  await expect(decisions).toHaveCount(2);

  for (const decision of await decisions.all()) {
    await expect(decision).toContainText('Decision');
    await expect(decision).toContainText('Reasoning');
    await expect(decision).toContainText('Trade-off');
  }
});

test('the project gallery gives every visual context and adapts its hierarchy', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openPage(page, caseStudyPath);

  const gallery = page.getByRole('region', { name: 'Project Gallery' });
  const figures = gallery.locator('figure');
  const featuredFigure = figures.first();

  await expect(figures).toHaveCount(3);

  for (const figure of await figures.all()) {
    await expect(figure.locator('img')).toHaveAttribute('alt', /\S+/);
    await expect(figure.locator('figcaption')).not.toBeEmpty();
  }

  const [desktopFeaturedBox, desktopSupportingBox] = await readBoundingBoxes(
    featuredFigure,
    figures.nth(1),
  );

  expect(desktopFeaturedBox).not.toBeNull();
  expect(desktopSupportingBox).not.toBeNull();
  expect(desktopFeaturedBox!.width).toBeGreaterThan(
    desktopSupportingBox!.width * 1.8,
  );

  await page.setViewportSize({ width: 768, height: 900 });

  const [tabletFeaturedBox, tabletSupportingBox] = await readBoundingBoxes(
    featuredFigure,
    figures.nth(1),
  );

  expect(tabletFeaturedBox).not.toBeNull();
  expect(tabletSupportingBox).not.toBeNull();
  expect(tabletFeaturedBox!.width).toBeGreaterThan(
    tabletSupportingBox!.width * 1.8,
  );

  await page.setViewportSize({ width: 375, height: 812 });

  const [mobileFeaturedBox, mobileSupportingBox] = await readBoundingBoxes(
    featuredFigure,
    figures.nth(1),
  );

  expect(mobileFeaturedBox).not.toBeNull();
  expect(mobileSupportingBox).not.toBeNull();
  expect(Math.abs(mobileFeaturedBox!.width - mobileSupportingBox!.width)).toBeLessThan(
    2,
  );
});

test('featured work keeps equal prominence at desktop, tablet, and mobile widths', async ({
  page,
}) => {
  const cards = page
    .getByRole('region', { name: 'Featured work' })
    .getByRole('article');

  await page.setViewportSize({ width: 1280, height: 900 });
  await openPage(page, '/');

  const desktopBoxes = await readElementBoxes(cards);

  expect(desktopBoxes).toHaveLength(3);
  expect(new Set(desktopBoxes.map(({ y }) => Math.round(y))).size).toBe(1);
  expect(Math.max(...desktopBoxes.map(({ width }) => width))).toBeLessThan(
    Math.min(...desktopBoxes.map(({ width }) => width)) + 2,
  );

  await page.setViewportSize({ width: 768, height: 900 });

  const tabletBoxes = await readElementBoxes(cards);

  expect(Math.abs(tabletBoxes[0].width - tabletBoxes[2].width)).toBeLessThan(2);
  expect(Math.round(tabletBoxes[0].y)).toBe(Math.round(tabletBoxes[1].y));
  expect(tabletBoxes[2].y).toBeGreaterThan(tabletBoxes[0].y);

  const tabletGrid = await page
    .locator('.featured-work__grid')
    .evaluate((element) => element.getBoundingClientRect().toJSON());
  const finalCardCenter = tabletBoxes[2].x + tabletBoxes[2].width / 2;
  const gridCenter = tabletGrid.x + tabletGrid.width / 2;

  expect(Math.abs(finalCardCenter - gridCenter)).toBeLessThan(2);

  await page.setViewportSize({ width: 375, height: 812 });

  const mobileBoxes = await readElementBoxes(cards);

  expect(new Set(mobileBoxes.map(({ x }) => Math.round(x))).size).toBe(1);
  expect(mobileBoxes[1].y).toBeGreaterThan(mobileBoxes[0].y);
  expect(mobileBoxes[2].y).toBeGreaterThan(mobileBoxes[1].y);
  expect(Math.max(...mobileBoxes.map(({ width }) => width))).toBeLessThan(
    Math.min(...mobileBoxes.map(({ width }) => width)) + 2,
  );
});

test('every internal link resolves without a 404 response', async ({
  page,
  request,
}) => {
  const paths = ['/', ...caseStudies.map(({ path }) => path)];

  for (const path of paths) {
    await openPage(page, path);

    const destinations = await page.locator('a[href]').evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter(
          (href): href is string =>
            href !== null && (href.startsWith('/') || href.startsWith('#')),
        ),
    );

    for (const destination of destinations) {
      const response = await request.get(
        destination.startsWith('#') ? `/${destination}` : destination,
      );

      expect(
        response.status(),
        `${path} links to ${destination}`,
      ).toBeLessThan(400);
    }
  }
});

test('static pages do not contain unexpected hydrated components', async ({
  page,
}) => {
  for (const portfolioPage of portfolioPages) {
    await openPage(page, portfolioPage.path);
    await expect(page.locator('astro-island')).toHaveCount(0);
  }
});

test('the homepage leads from positioning through work and capabilities to contact', async ({
  page,
}) => {
  await openPage(page, '/');

  const homepageSections = page.locator('main > section');

  await expect(homepageSections).toHaveCount(3);
  expect(
    await homepageSections.evaluateAll((sections) =>
      sections.map((section) =>
        section.querySelector('h1, h2')?.textContent?.trim(),
      ),
    ),
  ).toEqual([
    'Operational improvement work, documented clearly.',
    'Featured work',
    'What I do',
  ]);

  const capabilities = page.getByRole('region', { name: 'What I do' });

  await expect(capabilities.getByRole('listitem')).toHaveCount(3);
  await expect(capabilities).toContainText('Provisional capability guide');

  const contact = page.getByRole('region', { name: 'Contact' });

  await expect(contact).toBeVisible();
  await expect(contact.evaluate((element) => getComputedStyle(element).backgroundColor))
    .resolves.toBe('rgb(17, 17, 17)');
});

test('shared contact and footer follow the main content on every page', async ({
  page,
}) => {
  for (const path of ['/', caseStudyPath]) {
    await openPage(page, path);

    const bodyChildren = page.locator('body > header, body > main, body > section, body > footer');

    await expect(bodyChildren).toHaveCount(4);
    await expect(bodyChildren.nth(0)).toHaveAttribute('class', /site-header/);
    await expect(bodyChildren.nth(1)).toHaveJSProperty('tagName', 'MAIN');
    await expect(bodyChildren.nth(2)).toHaveAttribute('aria-label', 'Contact');
    await expect(bodyChildren.nth(3)).toHaveAttribute('class', /site-footer/);

    const footer = page.getByRole('contentinfo');

    await expect(footer).toContainText('J. Allekine');
    await expect(footer).toContainText(new Date().getFullYear().toString());
    await expect(footer.getByRole('link', { name: 'Back to top' })).toHaveAttribute(
      'href',
      '#top',
    );
  }
});

test('unconfigured contact actions stay visible without fake destinations @unconfigured', async ({
  page,
}) => {
  const contact = await openHomepageContact(page);

  await expect(contact.getByText('Email', { exact: true })).toBeVisible();
  await expect(contact.getByText('Resume', { exact: true })).toBeVisible();
  await expect(contact.getByText('GitHub', { exact: true })).toBeVisible();
  await expect(contact.getByText('Not configured', { exact: true })).toHaveCount(3);
  await expect(contact.getByRole('link')).toHaveCount(0);
  await expect(contact.locator('a[href="#"]')).toHaveCount(0);

  const unavailableActions = contact.locator('.contact__unavailable');
  const emailFontSize = await unavailableActions
    .nth(0)
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  const resumeFontSize = await unavailableActions
    .nth(1)
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));

  expect(emailFontSize).toBeGreaterThan(resumeFontSize);
});

test('configured contact actions become real destinations', async ({
  page,
}) => {
  const contact = await openHomepageContact(page);
  const email = contact.getByRole('link', {
    name: /portfolio-owner@example\.test/,
  });

  await expect(email).toHaveAttribute(
    'href',
    'mailto:portfolio-owner@example.test',
  );
  await expect(contact.getByRole('link', { name: 'View resume' })).toHaveAttribute(
    'href',
    'https://example.test/resume',
  );
  await expect(contact.getByRole('link', { name: 'View GitHub' })).toHaveAttribute(
    'href',
    'https://example.test/github',
  );
  await expect(contact.getByText('Not configured', { exact: true })).toHaveCount(0);
  await expect(contact.locator('a[href="#"]')).toHaveCount(0);
});

test('the footer back-to-top link returns a reader to the page start', async ({
  page,
}) => {
  await openPage(page, caseStudyPath);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);

  await page.getByRole('link', { name: 'Back to top' }).click();

  await expect(page).toHaveURL(/#top$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('typography keeps reading copy calm and metadata secondary', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openPage(page, caseStudyPath);
  await page.evaluate(() => document.fonts.ready);

  const bodyTypography = await page.locator('body').evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      family: style.fontFamily,
      size: Number.parseFloat(style.fontSize),
      lineHeight: Number.parseFloat(style.lineHeight),
      weight: style.fontWeight,
    };
  });

  expect(bodyTypography.family).toContain('Geist Variable');
  expect(bodyTypography.size).toBeGreaterThanOrEqual(17);
  expect(bodyTypography.size).toBeLessThanOrEqual(18);
  expect(bodyTypography.lineHeight / bodyTypography.size).toBeCloseTo(1.6, 2);
  expect(bodyTypography.weight).toBe('400');

  const fontResources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map((entry) => new URL(entry.name))
      .filter((url) => url.pathname.includes('geist'))
      .map(({ origin, pathname }) => ({ origin, pathname })),
  );

  expect(fontResources.length).toBeGreaterThanOrEqual(2);
  expect(fontResources.every((url) => url.origin === 'http://127.0.0.1:4322')).toBe(
    true,
  );
  expect(
    fontResources.some((url) => url.pathname.includes('geist-mono')),
  ).toBe(true);

  const headings = await page.locator('h1, h2, h3').evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);

      return {
        family: style.fontFamily,
        weight: style.fontWeight,
        letterSpacing: style.letterSpacing,
      };
    }),
  );

  expect(headings.length).toBeGreaterThan(0);
  for (const heading of headings) {
    expect(heading.family).toContain('Geist Variable');
    expect(['500', '600']).toContain(heading.weight);
    expect(
      heading.letterSpacing === 'normal' ||
        Number.parseFloat(heading.letterSpacing) >= 0,
    ).toBe(true);
  }

  const metadataFamilies = await page
    .locator(
      '.eyebrow, dt, .metadata-value, .problem-list strong, .evidence-label',
    )
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).fontFamily),
    );
  metadataFamilies.push(
    await page
      .locator('.workflow li')
      .first()
      .evaluate((element) => getComputedStyle(element, '::before').fontFamily),
  );

  expect(metadataFamilies.length).toBeGreaterThan(0);
  for (const family of metadataFamilies) {
    expect(family).toContain('Geist Mono Variable');
  }

  const paragraphFamilies = await page
    .locator(
      'p:not(.eyebrow):not(.evidence-label):not(.capability-ledger__number):not(.contact__label)',
    )
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).fontFamily),
    );

  for (const family of paragraphFamilies) {
    expect(family).not.toContain('Geist Mono Variable');
  }

  const readingParagraph = page.locator('.reading-column > p');
  const readingMeasure = await readingParagraph.evaluate((element) => {
    const paragraphBox = element.getBoundingClientRect();
    const measure = document.createElement('div');

    measure.style.position = 'fixed';
    measure.style.visibility = 'hidden';
    measure.style.width = '68ch';
    measure.style.font = getComputedStyle(element).font;
    document.body.append(measure);

    const maximumReadingWidth = measure.getBoundingClientRect().width;
    measure.remove();

    return {
      paragraphWidth: paragraphBox.width,
      maximumReadingWidth,
    };
  });

  expect(readingMeasure.paragraphWidth).toBeLessThanOrEqual(
    readingMeasure.maximumReadingWidth + 1,
  );
  expect(readingMeasure.paragraphWidth).toBeGreaterThanOrEqual(
    readingMeasure.maximumReadingWidth * (60 / 68) - 1,
  );
});

test('interaction feedback stays within the restrained motion system', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openPage(page, '/');

  const transitionStyles = await page.locator('body *').evaluateAll((elements) =>
    elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const durations = style.transitionDuration
        .split(',')
        .map((duration) => Number.parseFloat(duration) * 1000);

      return durations
        .filter((duration) => duration > 0)
        .map((duration) => ({
          duration,
          timings: style.transitionTimingFunction
            .split(',')
            .map((timing) => timing.trim()),
        }));
    }),
  );

  expect(transitionStyles.length).toBeGreaterThan(0);
  for (const transition of transitionStyles) {
    expect(transition.duration).toBeGreaterThanOrEqual(160);
    expect(transition.duration).toBeLessThanOrEqual(200);
    expect(transition.timings.every((timing) => timing === 'ease-out')).toBe(
      true,
    );
  }

  const card = page.locator('.card').first();
  const cardLink = card.locator('.card__link');
  const arrow = cardLink.locator('[aria-hidden="true"]');

  await expect(card).toHaveCSS('transform', 'none');
  await cardLink.hover();
  await expect(card).toHaveCSS('transform', 'none');

  await expect
    .poll(() =>
      arrow.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return matrix.m41;
      }),
    )
    .toBeGreaterThanOrEqual(3);
  const arrowMovement = await arrow.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return matrix.m41;
  });
  expect(arrowMovement).toBeLessThanOrEqual(4);

  const animatedElements = await page.locator('body *').evaluateAll((elements) =>
    elements.filter(
      (element) => getComputedStyle(element).animationName !== 'none',
    ).length,
  );

  expect(animatedElements).toBe(0);
});

test('reduced motion removes nonessential movement from elements and pseudo-elements', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/');

  const reducedMotionStyles = await page
    .locator('.card__link')
    .first()
    .evaluate((element) => {
      const readDurations = (pseudo?: '::before' | '::after') => {
        const style = getComputedStyle(element, pseudo);

        return {
          animation: style.animationDuration,
          transition: style.transitionDuration,
        };
      };

      return {
        scrollBehavior: getComputedStyle(
          document.documentElement,
        ).scrollBehavior,
        element: readDurations(),
        before: readDurations('::before'),
        after: readDurations('::after'),
      };
    });

  expect(reducedMotionStyles.scrollBehavior).toBe('auto');
  for (const target of [
    reducedMotionStyles.element,
    reducedMotionStyles.before,
    reducedMotionStyles.after,
  ]) {
    expect(Number.parseFloat(target.animation)).toBeCloseTo(0.00001, 8);
    expect(Number.parseFloat(target.transition)).toBeCloseTo(0.00001, 8);
  }
});
