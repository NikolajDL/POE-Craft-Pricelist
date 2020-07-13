# POE Craft Pricelist

A tool for generating Path of Exile Harvest Seed Crafting pricelists, for posting at the [TFT Discord](https://discord.gg/UnXR9d) channel.

The project sprung from my laziness of manually updating my pricelist when posting to the WTS TFT channel.


## Requirements

The tools is written in Javascript ES6 and thus requires NodeJS to run. 

- NodeJS 12.18 
- Yarn or NPM

## Getting started

I've included a `sample.yaml`-file containing some sample crafts and prices for the first run. 

To get started, download this project and open a terminal/commandprompt/powershell within the folder with the scripts.

#### First install the dependencies:
```
yarn
```
or
```
npm install
```

#### Then run the generator:

```
yarn start
```
or
```
npm start
```

You should now see a new file generated called `price-list.txt` which contains the generated pricelist:

```
[HSC] WTS
All crafts are tier 76+ if not stated otherwise
IGN: MySampleIngameName


[#################### AUGMENT ###################]
(x1) Augment Fire Lucky......................[50c]


[#################### REMOVE ####################]
(x1) Remove Cold.............................[30c]
(x3) Remove Life.............................[40c]


[#################### SOCKETS ###################]
(x1) Non-Blue -> Blue........................[30c]


Can stream on discord
Please vouch
```

## Crafts and Configuration

Once you're set up and have verified that it's working, you're ready to configure your own prices and crafts.

Your prices and available crafts are defined in a `.yaml` configuration file. The project includes a `sample.yaml` file to get started:

```yaml
options: 
  # discount: 0.2
  # maxShownPrice: 40

header:
  - '[HSC] WTS'
  - 'All crafts are tier 76+ if not stated otherwise'
  - 'IGN: MySampleIngameName'

footer:
  - 'Can stream on discord'
  - 'Please vouch'

crafting_stations:
  primal:
    - crafts:
      - remove_add_defence
      - aug_defence
      - aug_defence
  vivid:
    - crafts:
      - remove_life
      - remove_life
      - remove_life
    - crafts:
      - aug_fire_lucky
      - remove_cold
  stash:
    - crafts:
      - socket_non_blue_blue

categories:
  - label: Augment
    crafts:
      aug_fire_lucky:
        name: Augment Fire Lucky
        price: 50c
      aug_defence_lucky:
        name: Augment Defence Lucky
        price: 50c

  - label: Remove
    crafts:
      remove_cold:
        name: Remove Cold
        price: 30c
      remove_life:
        name: Remove Life
        price: 40c
  
  - label: Sockets
    crafts:
      socket_non_blue_blue:
        name: Non-Blue -> Blue
        price: 30c
```

### Options
Contains options for the generator such and fill characters, line width, etc.
The options are defined under the `options` section:

```yaml
options: 
  maxShownPrice: 40
  discount: 0.2
```

If an option isn't defined, the default value is used.

| Option  	          | Default  	| Description  	                                                                                                      |
|---	                |---	      |---	                                                                                                                |
| `categoryFill`  	  | '#'  	    | A fill character used to fill category headers.                                                                     |
| `craftFill`  	      | '.'  	    | A fill character to fill the space between the craft-name and price.	                                              |
| `lineWidth`  	      | 50  	    | The target width of each generated line.   	                                                                        |
| `maxShownPrice`  	  | MAX_INT  	| A filter to only include prices above a certain amount. Useful when focusing on selling cheap crafts.               | 
| `discount`  	      | 0  	      | A discount multiplier to apply to all prices. A with a price of 40c and discount of 0.25 the price is set to 30c. 	|
| `exaltedToChaos`  	| 160  	    | The currency exchange-rate between chaos and exalted orbs. Used by the `maxShownPrice` filter.	                    |
| `wrapMarkdownCode`  | true  	  | Whether to wrap the list in a markdown code section, to enforce monospaced characters on Discord.                   |

### Header

The header is used to write lines of text at the beginning of the pricelist. 
Each line under the `header` section is a new line in the pricelist:
```yaml
header
  - [HSC] WTS
  - This is the second line
  - This is the third line
```

The config above is generated as:
```
[HSC] WTS
This is the second line
This is the third line
```

### Footer

The footer works similar to the header, but instead adds the lines to the end of the pricelist.
```yaml
footer
  - This is the last line
```

### Crating stations

The crafting stations section is where you declare which crafts you have available. 
It is structured to match where your crafts are placed in your horticrafting stations, in order to make it easier to find, add or remove crafts from your list.

If you for instance have two primal horticrafting stations with 2 crafts each, you could declare it as such:

```yaml
crafting_stations:
  primal:
    - crafts:
      - aug_defence
      - aug_defence
    - crafts:
      - remove_life
      - remove_life
```

The crafts `aug_defence`, `remove_life`, etc. are defined in the last `categories` configuration section.

### Categories

In this configuration section you define which crafts you want to show in your pricelist and how you want to categorise them. 
This is also where you set the price of your crafting recipe.

If you for instance want to define the crafts you've declared in the `crafting_stations`-section above, you could do it like this:

```yaml
categories:
  - label: Augment
    crafts:
      aug_defence:
        name: Augment Defence
        price: 60c

  - label: Remove
    crafts:
      remove_life:
        name: Remove Life
        price: 40c
```

Notice how the labels `aug_defence` and `remove_life` matches the crafts defined in your `crafting_stations`-section. 

When the pricelist is generated with default options, the above categories would result in the following pricelist:

```
[#################### AUGMENT ###################]
(x2) Augment Defence.........................[60c]


[#################### REMOVE ####################]
(x2) Remove Life.............................[40c]
```

If you have categories defined in this section, 
but havn't got any available in your crafting stations, they're removed from the pricelist by default, 
so only available crafting recipes are included. This behaviour can be configured in the options.

## Acknowledgements

Big thank you to the community behind [The Forbidden Trove](https://forbiddentrove.com/), for providing great tools and a home to other Path of Exile enthusiasts.

## Donate

While this project was primarily meant for myself, as a product of my hatret for manual tasks, I would much appreciate any donations from people who find this useful. 

I'm currently playing Harvest Standard and my IGN is `Elrdar` and any ingame donation is cherished. 
