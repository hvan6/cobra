# -*- coding: utf-8 -*-

"""Visualization utilities
"""

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

__all__ = ['plot_rvb_curve']


def y_formatter(y, loc):
    y = '%i' % (y.round() / 1e3)
    if len(y) > 3:
        return '$%.1fM' % (float(y) / 1e3)
    else:
        return '$%sK' % y


def crossover(a):
    sign = np.sign(a)
    idx, = np.where(sign[:-1] != sign[1:])
    idx += 1
    return idx


def plot_rvb_curve(r, b, show_crossover=True, **fig_kwargs):

    sns.set_palette('colorblind')
    sns.set_style('darkgrid')

    years = np.arange(1, r.size + 1)

    fig = plt.figure(**fig_kwargs)
    fig.clf()
    ax = fig.gca()

    ax.plot(years, r, label='Rent')
    ax.plot(years, b, label='Buy')

    ymin, ymax = ax.get_ylim()
    ymax = ymax + 0.2 * (ymax - ymin)

    if show_crossover:
        idx = crossover(r - b)
        ax.vlines(years[idx], ymin, ymax, color='k', linestyle='--')

    ax.set_xlim(1, r.size)
    ax.set_ylim(ymin, ymax)

    ax.legend(loc='upper right', frameon=True, framealpha=1.0, facecolor='w')
    ax.yaxis.set_major_formatter(plt.FuncFormatter(y_formatter))
    ax.set_xlabel('Year')
    ax.set_ylabel('Net Value')

    sns.reset_defaults()

    return fig
