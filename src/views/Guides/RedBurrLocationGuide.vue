<template>

<h2>Where do Red Burrs appear?</h2>
<p>
    When a Red Burr is created by a direct move (i.e. immediately after making a move), it will appear where you moved the burr to complete the 5x. When it is created by a combo (i.e. the moves that occur after your move, due to the holes created), it will appear in a different place.
</p>
<p>
    To understand where it will appear, we need to define how a Red Burr is actually created.
</p>


<h5>Matches</h5>
<p>A <i>match</i> is three or more of the same type of ball that are next to each other, either horizontally or vertically.</p>

<img src="./img/mohist/match-example.png">

<h5>Chains</h5>
<p>A <i>chain</i> is two or more matches that intersect on a single ball.</p>

<p>In this case, the golds form a chain because there are two matches on a single ball (the reversed L-shape).</p>

<p>The silvers do because, as a neighbouring four-match sharing a ball with a three-match, they intersect on a single ball.</p>

<p>The purples do not, because they intersect on two - the centre purples.</p>

<img src="./img/mohist/chain-example.png">

<h5>Red Burrs</h5>
<p>
    A Red Burr is created when a chain is created. The typical explanation is "it's five in a row but can also be an L or a plus". This definition, however, doesn't suffice for chains that are made up of more than two matches.
</p>

<p>For example, this is a board that came about by using a Switch Stone:</p>
<img src="./img/mohist/switch-stone-board.png">

<p>Going by the typical definition, you would expect many Red Burrs to be created. In reality, only two are, because there are only two chains here.</p>
<img src="./img/mohist/switch-stone-board-chains.png">

<h5>Where do Red Burrs appear?</h5>
<p>For a given chain created by a combo, the Red Burr will appear at the <i>highest</i> ball of the entire chain. If there are many balls at the top, it will appear in the <i>leftmost</i> ball of that set.</p>
<img src="./img/mohist/switch-stone-board-burr.png">

<p><i>Note: the "Red Burr appearing" animation plays while balls are falling, so it looks like it appears lower than it actually does.</i></p>

</template>