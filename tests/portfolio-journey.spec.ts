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
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(path);
      return;
    } catch (error) {
      const previewIsStarting =
        error instanceof Error &&
        (error.message.includes('ERR_CONNECTION_REFUSED') ||
          error.message.includes('ERR_SOCKET_NOT_CONNECTED'));

      if (!previewIsStarting || attempt === 3) {
        throw error;
      }

      await page.waitForTimeout(200);
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
