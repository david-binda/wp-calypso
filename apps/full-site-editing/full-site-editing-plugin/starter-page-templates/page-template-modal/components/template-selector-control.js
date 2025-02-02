/**
 * External dependencies
 */
import { isEmpty, noop, map } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withInstanceId, compose } from '@wordpress/compose';
import { BaseControl } from '@wordpress/components';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TemplateSelectorItem from './template-selector-item';
import replacePlaceholders from '../utils/replace-placeholders';

const TemplateSelectorControl = ( {
	label,
	className,
	help,
	instanceId,
	templates = {},
	blocksByTemplates = {},
	useDynamicPreview = false,
	onTemplateSelect = noop,
	onTemplateFocus = noop,
	siteInformation = {},
} ) => {
	if ( isEmpty( templates ) ) {
		return null;
	}

	const id = `template-selector-control-${ instanceId }`;

	return (
		<BaseControl
			label={ label }
			id={ id }
			help={ help }
			className={ classnames( className, 'template-selector-control' ) }
		>
			<ul className="template-selector-control__options">
				{ map( templates, ( { slug, title, preview, previewAlt } ) => (
					<li key={ `${ id }-${ slug }` } className="template-selector-control__template">
						<TemplateSelectorItem
							id={ id }
							value={ slug }
							label={ replacePlaceholders( title, siteInformation ) }
							help={ help }
							onSelect={ onTemplateSelect }
							onFocus={ onTemplateFocus }
							staticPreviewImg={ preview }
							staticPreviewImgAlt={ previewAlt }
							blocks={ blocksByTemplates.hasOwnProperty( slug ) ? blocksByTemplates[ slug ] : [] }
							useDynamicPreview={ useDynamicPreview }
						/>
					</li>
				) ) }
			</ul>
		</BaseControl>
	);
};

export default compose(
	memo,
	withInstanceId
)( TemplateSelectorControl );
