import { expect, test, type Page } from '@playwright/test';

const caseStudyPath = '/work/project-details-pending/';

async function openPage(page: Page, path: string) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(path);
      return;
    } catch (error) {
      const previewIsStarting =
        error instanceof Error &&
        error.message.includes('ERR_CONNECTION_REFUSED');

      if (!previewIsStarting || attempt === 3) {
        throw error;
      }

      await page.waitForTimeout(200);
    }
  }
}

test('a hiring manager can open one featured case study and review its overview', async ({
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
  const card = featuredWork.getByRole('article');

  await expect(card).toHaveCount(1);
  await expect(card).toContainText('Project 01');
  await expect(card).toContainText('Category');
  await expect(card).toContainText('Role');
  await expect(card).toContainText('System type');
  await expect(card).toContainText('Year');
  await expect(card).toContainText('Tools');

  await card.getByRole('link', { name: /open provisional case study/i }).click();

  await expect(page).toHaveURL(/\/work\/project-details-pending\/$/);
  await expect(page).toHaveTitle(/Case Study Pending/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Project title pending' }),
  ).toBeVisible();

  const overview = page.getByRole('region', { name: 'Overview' });

  await expect(overview).toContainText('Project title pending');
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

  const desktopFeaturedBox = await featuredFigure.boundingBox();
  const desktopSupportingBox = await figures.nth(1).boundingBox();

  expect(desktopFeaturedBox).not.toBeNull();
  expect(desktopSupportingBox).not.toBeNull();
  expect(desktopFeaturedBox!.width).toBeGreaterThan(
    desktopSupportingBox!.width * 1.8,
  );

  await page.setViewportSize({ width: 375, height: 812 });

  const mobileFeaturedBox = await featuredFigure.boundingBox();
  const mobileSupportingBox = await figures.nth(1).boundingBox();

  expect(mobileFeaturedBox).not.toBeNull();
  expect(mobileSupportingBox).not.toBeNull();
  expect(Math.abs(mobileFeaturedBox!.width - mobileSupportingBox!.width)).toBeLessThan(
    2,
  );
});
