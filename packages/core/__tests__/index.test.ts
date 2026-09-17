// Allows typing of CSS resolves
/// <reference types="vite/client" />
import { DateTime } from '@yuafox/easepick2-datetime';
import { RangePlugin } from '@yuafox/easepick2-range-plugin';
import { TimePlugin } from '@yuafox/easepick2-time-plugin';
import { page } from 'vitest/browser';
import {vi, test, expect, beforeEach} from 'vitest';
import * as easepick from '../src/index';
import pkg from '../package.json';

import coreCss from '../src/scss/index.scss?url';
import timeCss from '@yuafox/easepick2-time-plugin/index.css?url';
import rangeCss from '@yuafox/easepick2-range-plugin/index.css?url';

// 23 Nov, 2019 - repository creation date
const date = new DateTime(new Date(2019, 10, 23, 0, 0, 0, 0));

window.matchMedia = vi.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
});
window['__VERSION__'] = pkg.version;

beforeEach(() => {
  document.body.innerHTML = '';
  document.body.innerHTML = '<input id="datepicker"/>';
})

test('date', () => {
  const d = date.clone();
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    date: d,
  });

  expect(picker.getDate() instanceof DateTime && picker.getDate().format('D MMM YYYY') === '23 Nov 2019').toBe(true);
});

test('firstDay', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    firstDay: 0,
  });

  expect(picker.ui.container.querySelector('.dayname')!.textContent === 'Sun').toBe(true);
});

test('format', () => {
  const d = date.clone();
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    date: d.format('D MMM YYYY'),
    format: 'D MMM YYYY',
  });

  expect(picker.getDate() instanceof DateTime && picker.getDate().format('D MMM YYYY') === '23 Nov 2019').toBe(true);
});

test('grid', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    grid: 2,
  });

  expect(picker.ui.container.querySelector('.calendars')!.classList.contains('grid-2')).toBe(true);
});

test('calendars', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    calendars: 2,
  });

  expect(picker.ui.container.querySelectorAll('.calendar').length === 2).toBe(true);
});

test('lang', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    lang: 'ru-RU',
  });

  expect(picker.ui.container.querySelector('.dayname')!.textContent === 'пн').toBe(true);
});

test('readonly', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    readonly: false,
  });

  expect((picker.options.element as HTMLInputElement).readOnly).toBe(false);
});

test('autoApply', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    autoApply: false,
  });

  expect(picker.ui.container.querySelector('footer') instanceof HTMLElement).toBe(true);
});

test('locale', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    autoApply: false,
    locale: {
      apply: 'OK',
    }
  });

  expect(picker.ui.container.querySelector('.apply-button')!.textContent === 'OK').toBe(true);
});

test('plugins', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    plugins: [RangePlugin],
  });

  expect(picker.ui.container.querySelector('.range-plugin-tooltip') instanceof HTMLElement).toBe(true);
});

test('documentClick default', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
  });
  (picker.options.element as HTMLElement).dispatchEvent(new Event('click'));
  expect(picker.ui.container.classList.contains('show')).toBe(true);

  document.dispatchEvent(new Event('click'));
  expect(picker.ui.container.classList.contains('show')).toBe(false);
});


test('documentClick false', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    documentClick: false,
  });

  (picker.options.element as HTMLElement).dispatchEvent(new Event('click'));
  expect(picker.ui.container.classList.contains('show')).toBe(true);

  document.dispatchEvent(new Event('click'));
  expect(picker.ui.container.classList.contains('show')).toBe(true);
});

test('setup', () => {
  let picker = new easepick.create({
    element: document.getElementById('datepicker')!,
    setup(picker) {
      picker.setDate(date);
    }
  });

  expect(picker.getDate() instanceof DateTime && picker.getDate().format('D MMM YYYY') === '23 Nov 2019').toBe(true);
});

test('Time select autoApply', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime('2026-09-17T07:08:16.555Z');

  const spy = vi.fn();
  const element = document.getElementById('datepicker')!;

  const picker = new easepick.create({element, css: [coreCss, timeCss], plugins: [TimePlugin], autoApply: true});
  picker.on('select', spy);

  const input = await page.getByRole('textbox');
  await expect.element(input).toBeInTheDocument();

  await input.click();

  const day20 = await page.getByRole('button').getByText('20');
  await expect.element(day20).toBeInTheDocument();
  await day20.click()

  expect(spy).toHaveBeenCalled();

  await input.click();

  const hours = await page.getByRole('combobox', {name: 'hour'});
  await hours.selectOptions('10');

  expect(spy).toHaveBeenCalledTimes(2);
});

test('Time select autoApply range', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime('2026-09-17T07:08:16.555Z');

  const spy = vi.fn();
  const element = document.getElementById('datepicker')!;

  const picker = new easepick.create({element, css: [coreCss, timeCss, rangeCss], plugins: [TimePlugin, RangePlugin], autoApply: true});
  picker.on('select', spy);

  const input = await page.getByRole('textbox');
  await expect.element(input).toBeInTheDocument();

  await input.click();

  const day20 = await page.getByRole('button').getByText('20');
  await expect.element(day20).toBeInTheDocument();
  await day20.click();

  const day22 = await page.getByRole('button').getByText('22');
  await expect.element(day22).toBeInTheDocument();
  await day22.click()

  expect(spy).toHaveBeenCalled();

  await input.click();

  const startHours = await page.getByRole('combobox', {name: 'start hour'});
  await startHours.selectOptions('10');

  const endHours = await page.getByRole('combobox', {name: 'end hour'});
  await endHours.selectOptions('10');

  expect(spy).toHaveBeenCalledTimes(3);
});
