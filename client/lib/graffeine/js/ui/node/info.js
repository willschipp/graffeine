/**
 *  Node Information
 *
 *  Mouseover node info
 *  This is a tooltip, not a modal
 *
**/

Graffeine.ui.nodeInfo = (function(G) { 

    var self = this;
    var ui = G.ui;
    var config = G.config;

    var data = { 
        selectors: { 
            target:  "#node-info-container",
            content: "#node-info-content",
            buttons: {},
            fields: { 
                paths: "#node-paths",
                labels: "#node-labels"
            }
        },
        viewURL: config.root + "html/node-info.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 

        $(data.selectors.content).hide();

        //var event = $.Event("show.gf.popup");
        //$(data.selectors.content).triggerHandler(event);

        ui.util.event(data.selectors.content, "show.gf.popup", function(e, hoverData) { 
            var node = hoverData.node;
            var elem = hoverData.element;
            if(elem===null) return;
            var pos = $(elem).offset();
            var pathsHTML = renderPaths(node.id, node.paths(graph));
            $(data.selectors.fields.paths).html(pathsHTML);
            var labels = node.labels.join(', ');
            $(data.selectors.fields.labels).html(labels);
            $(data.selectors.content).css("left", (pos.left + (2*config.node.radius) + 10) + "px");
            $(data.selectors.content).css("top", (pos.top - 25) + "px");
        });

        ui.util.event(data.selectors.content, "hide.gf.popup", function(e) { 
            $(data.selectors.fields.paths).empty();
            $(data.selectors.fields.labels).empty();
        });

    };

    function renderPaths(nodeIndex, paths) { 

        if(paths.length === 0) { 
            var container = $("<div>");
            var span = $("<span>")
                .addClass("glyphicon glyphicon-transfer relationship")
                .attr("aria-hidden", "true");
            var text = "No Relationships";
            container.append(span);
            container.append(text);
            return container;
        }

        var container = $("<div>");
        paths.forEach(function(path) { 
            var right = $("<span>").addClass("glyphicon glyphicon-arrow-right relationship").attr("aria-hidden", "true");
            var left = $("<span>").addClass("glyphicon glyphicon-arrow-left relationship").attr("aria-hidden", "true");
            var stick = $("<span>").addClass("glyphicon glyphicon-minus relationship").attr("aria-hidden", "true");
            var holder = $("<div>")
            if(path.source.id === nodeIndex)
                var item = $("<span>").html(path.source.getName())
                    .append(stick)
                    .append(path.name)
                    .append(right)
                    .append(path.target.getName());
            else
                var item = $("<span>").html(path.target.getName())
                    .append(left)
                    .append(path.name)
                    .append(stick)
                    .append(path.source.getName());
            holder.append(item);
            container.append(holder);
        });
        return container;
    };

    return { 

        show: function(node, element) { 
            // don't show if a node drag is in progress
            if(Graffeine.ui.state.nodeDragged()) return;
            $(data.selectors.content).show(50, function() { 
                $(this).trigger("show.gf.popup", {node: node, element: element});
            });
        },

        hide: function() { 
            $(data.selectors.content).hide(50, function(e) { 
                $(this).trigger("hide.gf.popup"); 
            });
        }

    };

}(Graffeine));
