const HEADER_SPACING = '\n';
const CATEGORY_SPACING = '\n\n';
const CRAFT_SPACING = '\n';

const DEFAULT_OPTIONS = {
    categoryFill: '#',
    craftFill: '.',
    lineWidth: 50,
    maxShownPrice: Number.MAX_SAFE_INTEGER,
    discount: 0,
    exaltedToChaos: 160,
    wrapMarkupCode: true,
};

export default class Generator {
    generate(data) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...(data.options || {}),
        };

        let priceList = '';

        priceList += this.generateHeader(data.header);

        priceList += CATEGORY_SPACING;

        priceList += this.generateCategories(
            data.categories,
            data.crafting_stations
        );

        priceList += this.generateFooter(data.footer);

        if (this.options.wrapMarkupCode) {
            priceList = '```\n' + priceList + '\n```';
        }

        return priceList;
    }

    generateHeader(header) {
        if (!header) {
            return '';
        }

        return header.map(this.generateHeaderLine).join('');
    }

    generateHeaderLine(line) {
        return `${line}${HEADER_SPACING}`;
    }

    generateFooter(footer) {
        if (!footer) {
            return '';
        }

        return footer.map(this.generateFooterLine).join('');
    }

    generateFooterLine(line) {
        return `${line}${HEADER_SPACING}`;
    }

    generateCategories(categories, crafting_stations) {
        if (!categories) {
            return '';
        }

        const craftAmounts = this.calculateAmounts(crafting_stations);

        return categories
            .map((category) => this.generateCategory(category, craftAmounts))
            .join('');
    }

    calculateAmounts(crafting_stations) {
        const amounts = {};

        if (!crafting_stations) {
            return amounts;
        }

        const types = Object.keys(crafting_stations);

        types.forEach((type) => {
            crafting_stations[type] &&
                crafting_stations[type].forEach((station) => {
                    station.crafts &&
                        station.crafts.forEach((craft) => {
                            if (amounts[craft]) {
                                amounts[craft] += 1;
                            } else {
                                amounts[craft] = 1;
                            }
                        });
                });
        });

        return amounts;
    }

    generateCategory(category, craftAmounts) {
        if (
            !category ||
            !category.crafts ||
            !Object.keys(category.crafts).length
        ) {
            return '';
        }

        let result = '';

        result += this.generateCategoryLabel(category);
        result += '\n';

        const crafts = this.generateCrafts(category.crafts, craftAmounts);
        if (!crafts) {
            return '';
        }

        result += crafts;

        result += CATEGORY_SPACING;

        return result;
    }

    generateCategoryLabel(category) {
        if (!category || !category.label) {
            return '';
        }

        const fillLength = this.options.lineWidth - category.label.length - 4;
        const fillPartLength = Math.floor(fillLength / 2);
        const fillOverflow = fillLength % 2;
        const leftFill = this.options.categoryFill.repeat(
            fillPartLength + fillOverflow
        );
        const rightFill = this.options.categoryFill.repeat(fillPartLength);
        return `[${leftFill} ${category.label.toUpperCase()} ${rightFill}]`;
    }

    generateCrafts(crafts, craftAmounts) {
        if (!crafts) {
            return '';
        }

        crafts = this.mergeCraftAmounts(crafts, craftAmounts);

        return crafts
            .filter(this.onlyAvailableCrafts.bind(this))
            .filter(this.onlyBelowMaxPrice.bind(this))
            .map(this.generateCraft.bind(this))
            .join('');
    }

    mergeCraftAmounts(crafts, craftAmounts) {
        return Object.entries(crafts).map(([name, values]) => ({
            ...values,
            amount: craftAmounts[name] || 0,
        }));
    }

    onlyAvailableCrafts(craft) {
        return craft.amount > 0;
    }

    onlyBelowMaxPrice(craft) {
        const { asChaos } = this.parsePrice(craft.price);
        return asChaos <= this.options.maxShownPrice && asChaos > 0;
    }

    generateCraft(craft) {
        let result = '';

        result += `(x${craft.amount}) `;
        result += craft.name;

        const { price, currency } = this.parsePrice(craft.price);
        const discountedPrice = price - price * this.options.discount;
        const craftPrice = `[${discountedPrice}${currency}]`;
        const fillLength =
            this.options.lineWidth - result.length - craftPrice.length;
        result += this.options.craftFill.repeat(fillLength);

        result += craftPrice;

        result += CRAFT_SPACING;

        return result;
    }

    parsePrice(priceWithCurrency) {
        const parsedPrice = /^(\d+(?:\.\d+)?)(.*)$/.exec(priceWithCurrency);
        const price = parseFloat(parsedPrice[1]);
        const currency = parsedPrice[2];
        let asChaos = price;

        if (currency === 'ex') {
            asChaos = Math.floor(price * this.options.exaltedToChaos);
        }

        return {
            price,
            currency,
            asChaos,
        };
    }
}
