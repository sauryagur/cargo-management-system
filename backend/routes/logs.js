let express = require('express');
let router = express.Router();


let testLogs = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec convallis magna, vitae convallis mi. Aenean dignissim vitae massa ac ullamcorper. Praesent auctor lectus massa, id efficitur libero cursus in. Donec accumsan sem vel massa mollis, a bibendum lectus pulvinar. Quisque tincidunt dolor in metus tincidunt ullamcorper. Integer pharetra ac tellus a consequat. Aliquam sit amet justo vitae sem auctor hendrerit. Nullam iaculis at justo id volutpat. Sed ut ligula magna. Fusce non dignissim metus. Praesent tincidunt vel ante a placerat. Donec vel lobortis leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi vehicula ante quis nibh consectetur placerat ut varius neque. Praesent feugiat erat at lobortis ultrices. Nulla risus erat, blandit et enim sed, posuere tempor turpis.

Morbi facilisis ex sed ligula semper tincidunt. In sed ex nec dolor posuere aliquet. Aenean sed massa cursus, efficitur purus sed, elementum massa. Nam tristique nec nisl non mollis. Morbi a odio sit amet mauris mattis imperdiet a nec augue. Integer ut scelerisque enim. Proin aliquet mattis viverra. Nam non laoreet mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam cursus vel mi vel facilisis. Mauris vitae libero leo. Sed fermentum, est quis blandit egestas, erat mi aliquam lectus, ut iaculis tortor est a dui. Morbi in vulputate nunc, mollis hendrerit est.

Proin blandit egestas tortor, sit amet pharetra neque. Sed ut rutrum diam, et laoreet sapien. Nulla luctus lorem sapien, eget viverra risus congue nec. Proin cursus est vestibulum tincidunt condimentum. Proin ut mollis mi, a euismod sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla congue volutpat felis, id mollis risus rhoncus id. Sed condimentum suscipit felis, sit amet iaculis tortor lacinia interdum.

Nullam imperdiet in orci in aliquam. Etiam finibus lacinia feugiat. Mauris massa diam, malesuada at tellus nec, mattis vehicula enim. Suspendisse fringilla, leo sit amet auctor pellentesque, lectus dui faucibus libero, sit amet faucibus dolor lorem quis mi. Morbi eu sapien velit. Vestibulum vel pretium massa. Pellentesque non dui id elit facilisis pellentesque aliquet et neque. Sed in interdum nisi. Nam rutrum ante sed rutrum ullamcorper. Nullam ut leo ultrices, venenatis felis non, tristique dui. Vestibulum sit amet semper massa. Curabitur nec justo leo.

Fusce placerat neque vel nibh gravida facilisis. Sed sapien arcu, volutpat id interdum at, ultricies interdum augue. Ut varius elit non nunc imperdiet, sed venenatis turpis lobortis. Morbi dignissim semper odio. Phasellus nec orci magna. In eleifend diam magna, sed venenatis erat cursus quis. Fusce hendrerit nulla ligula, sed egestas arcu porttitor sed. Sed viverra, odio et ultrices egestas, ipsum sapien vulputate quam, ut eleifend tortor urna sed orci. Nullam egestas finibus nunc, eu porta lorem elementum id. Vestibulum pellentesque ac nunc nec cursus. Vestibulum eget diam placerat, dapibus odio et, congue dui. Cras dictum interdum mattis. Duis sodales purus in dui viverra efficitur. Curabitur vitae arcu dictum, rhoncus nibh nec, semper ipsum.`
/* POST retrieve item from container. */
router.get('/', function (req, res) {
    res.send(testLogs);
});

module.exports = router;
