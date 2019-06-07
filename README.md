# Rainbird Query Graph

**[Live demo](https://query-graph.netlify.com/)**

## Background

The inspiration for this project came from the idea of [call graph](https://en.wikipedia.org/wiki/Call_graph).

The idea being that rules are analogous to sub routines/functions in traditional programming languages. They can be defined once and referenced (called) any number of times throughout the execution of the model. From this idea, we can think about a call graph in Rainbird representing how relationships relate to each other through rules - you could call these meta-relationships but I'm not feeling that pretentious.

The query graph is a directed graph with relationships as nodes and conditions as edges. The direction of the edge indicates what is the rule and what is the condition, the source node being the rule and the target node being the condition which is being referenced.

### Example

Here's a small example to demonstrate the above concept.

The simplest of maps, hello world, would produce the following query graph:

[[https://github.com/tom-sherman/rainbird-query-graph/blob/master/graph-example.svg|alt=Example graph]]

We can see that our top level node "speaks", references two relationships: "born in" and "has national language". This is because the rule that is written on "speaks" uses both of the those relationships.

```xml
<relinst type="speaks" cf="100">
  <condition rel="born in" subject="%S" object="%COUNTRY" />
  <condition rel="has national language" subject="%COUNTRY" object="%O" weight="100" behaviour="mandatory" />
</relinst>
```

## Applied use cases

In general, a query graph can offer the same benefits as traditional call graphs eg. documentation, auditing, spotting dead code.

Specifically in a Rainbird context though, I think the query graph could offer an alternative visualisation of a rule and it's conditions or could aid in debugging. It could even be used as an interface to build rules - you can imagine a user adding new nodes onto the graph and connecting them together to form rules and conditions.

## Demo

The demo is written in React, utilising the `sigma` visualisation library to display the graph. It uses a Dagre algorithm to layout the nodes in the graph, that's what gives it the tree-like shape.

`parse.js` - A simple RBLang parser

`get-graph.js` - Transforms the RBLang object from `parse.js` into a format that the visualis

### Development

Install dependencies

```
# npm i
```

Start development server

```
npm start
```
