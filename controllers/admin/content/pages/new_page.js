/*

    Interface for adding a new page
    
    @author Blake Callens <blake.callens@gmail.com>
    @copyright PencilBlue 2013, All rights reserved

*/

this.init = function(request, output)
{
    var result = '';
    var instance = this;
    
    getSession(request, function(session)
    {
        if(!userIsAuthorized(session, {logged_in: true, admin_level: ACCESS_EDITOR}))
        {
            output({redirect: pb.config.siteRoot + '/admin'});
            return;
        }
    
        initLocalization(request, session, function(data)
        {
            getHTMLTemplate('admin/content/pages/new_page', '^loc_NEW_PAGE^', null, function(data)
            {
                result = result.concat(data);
                
                getAdminNavigation(session, ['content', 'articles'], function(data)
                {
                    result = result.split('^admin_nav^').join(data);
                
                    var tabs =
                    [
                        {
                            active: 'active',
                            href: '#content',
                            icon: 'quote-left',
                            title: '^loc_CONTENT^'
                        },
                        {
                            href: '#media',
                            icon: 'camera',
                            title: '^loc_MEDIA^'
                        },
                        {
                            href: '#topics_dnd',
                            icon: 'tags',
                            title: '^loc_TOPICS^'
                        },
                        {
                            href: '#meta_data',
                            icon: 'tasks',
                            title: '^loc_META_DATA^'
                        }
                    ];
                    
                    var pages = require('../pages');
                        
                    pages.getTemplates(function(templates)
                    {
                        getDBObjectsWithValues({object_type: 'topic', $orderby: {name: 1}}, function(topics)
                        {
                            pages.getMedia(function(media)
                            {                            
                                prepareFormReturns(session, result, function(newSession, newResult)
                                {
                                    session = newSession;
                                    result = newResult;
                                    
                                    result = result.concat(getAngularController({pills: pages.getPillNavOptions('new_page'), tabs: tabs, templates: templates, topics: topics, media: media}));
                        
                                    editSession(request, session, [], function(data)
                                    {
                                        output({content: localize(['admin', 'pages', 'articles', 'media'], result)});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
