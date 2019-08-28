/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import { getCurrentUser } from 'state/current-user/selectors';
import { getCurrentQueryArguments } from 'state/selectors/get-current-query-arguments';
import Gravatar from 'components/gravatar';

/**
 * Style dependencies
 */
import './continue-as-user.scss';

function ContinueAsUser( { currentUser, redirectUrlFromQuery } ) {
	const translate = useTranslate();
	const [ validatedRedirectUrl, setValidatedRedirectUrl ] = useState( '/' );

	useEffect( () => {
		async function validateUrl( redirectUrl ) {
			try {
				const response = await wpcom.req.get( '/me/validate-redirect', {
					redirect_url: redirectUrl,
				} );
				if ( response ) {
					setValidatedRedirectUrl( response.redirect_to || '/' );
				}
			} catch {
				// Ignore error, set the redirect link as a default `/`.
				setValidatedRedirectUrl( '/' );
			}
		}

		if ( ! redirectUrlFromQuery ) {
			return;
		}

		validateUrl( redirectUrlFromQuery );
	}, [ redirectUrlFromQuery ] );

	const userName = currentUser.display_name || currentUser.username;

	// Render ContinueAsUser straight away, even before validation.
	// This helps avoid jarring layout shifts. It's not ideal that the link URL changes transparently
	// like that, but it is better than the alternative, and in practice it should happen quicker than
	// the user can notice.
	const redirectLink = (
		<a href={ validatedRedirectUrl || '/' }>
			<Gravatar user={ currentUser } size={ 16 } />
			{ userName }
		</a>
	);

	return (
		<div className="continue-as-user">
			{ translate( 'or continue as {{userName/}}', {
				components: { userName: redirectLink },
				comment: 'Alternative link under login header, skips login to continue as current user.',
			} ) }
		</div>
	);
}

export default connect( state => ( {
	currentUser: getCurrentUser( state ),
	redirectUrlFromQuery: get( getCurrentQueryArguments( state ), 'redirect_to', null ),
} ) )( ContinueAsUser );
