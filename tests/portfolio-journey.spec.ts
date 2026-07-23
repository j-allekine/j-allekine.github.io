import { expect, test } from '@playwright/test';

test('a hiring manager can open one featured case study and review its overview', async ({
  page,
}) => {
  await page.goto('/');

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
