package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Maladie;
import com.ensaj.repository.MaladieRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link MaladieResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MaladieResourceIT {

    private static final String DEFAULT_FULL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FULL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ABBR = "AAAAAAAAAA";
    private static final String UPDATED_ABBR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/maladies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private MaladieRepository maladieRepository;

    @Autowired
    private MockMvc restMaladieMockMvc;

    private Maladie maladie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maladie createEntity() {
        Maladie maladie = new Maladie().fullName(DEFAULT_FULL_NAME).abbr(DEFAULT_ABBR);
        return maladie;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maladie createUpdatedEntity() {
        Maladie maladie = new Maladie().fullName(UPDATED_FULL_NAME).abbr(UPDATED_ABBR);
        return maladie;
    }

    @BeforeEach
    public void initTest() {
        maladieRepository.deleteAll();
        maladie = createEntity();
    }

    @Test
    void createMaladie() throws Exception {
        int databaseSizeBeforeCreate = maladieRepository.findAll().size();
        // Create the Maladie
        restMaladieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maladie)))
            .andExpect(status().isCreated());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeCreate + 1);
        Maladie testMaladie = maladieList.get(maladieList.size() - 1);
        assertThat(testMaladie.getFullName()).isEqualTo(DEFAULT_FULL_NAME);
        assertThat(testMaladie.getAbbr()).isEqualTo(DEFAULT_ABBR);
    }

    @Test
    void createMaladieWithExistingId() throws Exception {
        // Create the Maladie with an existing ID
        maladie.setId("existing_id");

        int databaseSizeBeforeCreate = maladieRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMaladieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maladie)))
            .andExpect(status().isBadRequest());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllMaladies() throws Exception {
        // Initialize the database
        maladieRepository.save(maladie);

        // Get all the maladieList
        restMaladieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(maladie.getId())))
            .andExpect(jsonPath("$.[*].fullName").value(hasItem(DEFAULT_FULL_NAME)))
            .andExpect(jsonPath("$.[*].abbr").value(hasItem(DEFAULT_ABBR)));
    }

    @Test
    void getMaladie() throws Exception {
        // Initialize the database
        maladieRepository.save(maladie);

        // Get the maladie
        restMaladieMockMvc
            .perform(get(ENTITY_API_URL_ID, maladie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(maladie.getId()))
            .andExpect(jsonPath("$.fullName").value(DEFAULT_FULL_NAME))
            .andExpect(jsonPath("$.abbr").value(DEFAULT_ABBR));
    }

    @Test
    void getNonExistingMaladie() throws Exception {
        // Get the maladie
        restMaladieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingMaladie() throws Exception {
        // Initialize the database
        maladieRepository.save(maladie);

        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();

        // Update the maladie
        Maladie updatedMaladie = maladieRepository.findById(maladie.getId()).orElseThrow();
        updatedMaladie.fullName(UPDATED_FULL_NAME).abbr(UPDATED_ABBR);

        restMaladieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMaladie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMaladie))
            )
            .andExpect(status().isOk());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
        Maladie testMaladie = maladieList.get(maladieList.size() - 1);
        assertThat(testMaladie.getFullName()).isEqualTo(UPDATED_FULL_NAME);
        assertThat(testMaladie.getAbbr()).isEqualTo(UPDATED_ABBR);
    }

    @Test
    void putNonExistingMaladie() throws Exception {
        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();
        maladie.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaladieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, maladie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(maladie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchMaladie() throws Exception {
        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();
        maladie.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(maladie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamMaladie() throws Exception {
        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();
        maladie.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladieMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maladie)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateMaladieWithPatch() throws Exception {
        // Initialize the database
        maladieRepository.save(maladie);

        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();

        // Update the maladie using partial update
        Maladie partialUpdatedMaladie = new Maladie();
        partialUpdatedMaladie.setId(maladie.getId());

        restMaladieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaladie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaladie))
            )
            .andExpect(status().isOk());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
        Maladie testMaladie = maladieList.get(maladieList.size() - 1);
        assertThat(testMaladie.getFullName()).isEqualTo(DEFAULT_FULL_NAME);
        assertThat(testMaladie.getAbbr()).isEqualTo(DEFAULT_ABBR);
    }

    @Test
    void fullUpdateMaladieWithPatch() throws Exception {
        // Initialize the database
        maladieRepository.save(maladie);

        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();

        // Update the maladie using partial update
        Maladie partialUpdatedMaladie = new Maladie();
        partialUpdatedMaladie.setId(maladie.getId());

        partialUpdatedMaladie.fullName(UPDATED_FULL_NAME).abbr(UPDATED_ABBR);

        restMaladieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaladie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaladie))
            )
            .andExpect(status().isOk());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
        Maladie testMaladie = maladieList.get(maladieList.size() - 1);
        assertThat(testMaladie.getFullName()).isEqualTo(UPDATED_FULL_NAME);
        assertThat(testMaladie.getAbbr()).isEqualTo(UPDATED_ABBR);
    }

    @Test
    void patchNonExistingMaladie() throws Exception {
        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();
        maladie.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaladieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, maladie.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(maladie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchMaladie() throws Exception {
        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();
        maladie.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(maladie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamMaladie() throws Exception {
        int databaseSizeBeforeUpdate = maladieRepository.findAll().size();
        maladie.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladieMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(maladie)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maladie in the database
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteMaladie() throws Exception {
        // Initialize the database
        maladieRepository.save(maladie);

        int databaseSizeBeforeDelete = maladieRepository.findAll().size();

        // Delete the maladie
        restMaladieMockMvc
            .perform(delete(ENTITY_API_URL_ID, maladie.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Maladie> maladieList = maladieRepository.findAll();
        assertThat(maladieList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
