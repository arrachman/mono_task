import React, { useEffect, useState } from 'react';

//libs
import { Link } from 'react-router-dom';
import { Menu, MenuLink } from '../styles';

const HorizontalMenubar = (props) => {
    //hooks
    const [rootNavigationOpen, setRootnavigationOpen] = useState(false);

    //listen route changes
    useEffect(() => {
        const listen = props.history.listen(() => {
            setRootnavigationOpen(false);
        });

        return listen
    }, [props.history]);

    return(
        <nav id="menu">
            <label onClick={() => setRootnavigationOpen(!rootNavigationOpen)} htmlFor="tm" id="toggle-menu">Navigation <span className="drop-icon"><i className="fa fa-chevron-down"></i></span></label>
            <input onChange={(e) => e.preventDefault()} type="checkbox" id="tm" checked={rootNavigationOpen}/>
            <ul className="main-menu clearfix">
                <Menu isSubmenu={true} label="Dashboard">
                    <MenuLink>
                        <Link to="/">E-Commerce</Link>
                    </MenuLink>
                </Menu>
                <Menu isSubmenu={true} label="Programming Test">
                    <MenuLink>
                        <Link to="/programmer-test/list-user">List User</Link>
                    </MenuLink>
                    <MenuLink>
                        <Link to="/programmer-test/list-task">List Task</Link>
                    </MenuLink>
                </Menu>
            </ul>
        </nav>
    );
}

export default HorizontalMenubar;