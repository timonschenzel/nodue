module.exports = class NavTest extends VueComponentTestCase
{
    it_is_able_to_render_the_component()
    {
        let component = this.render('<nav></nav>');

        this.assertEquals('<div></div>', this.component.toHtml());
    }

    it_is_able_to_render_the_component_with_a_different_setup()
    {
        let component = this.render('<nav active="false"></nav>');

        this.assertEquals('<div disabled></div>', this.component.toHtml());
    }
}
