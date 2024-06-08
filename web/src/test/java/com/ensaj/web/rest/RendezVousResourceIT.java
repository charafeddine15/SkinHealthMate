package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.RendezVous;
import com.ensaj.repository.RendezVousRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link RendezVousResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RendezVousResourceIT {

    private static final Instant DEFAULT_DATE_DEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_STATUT = false;
    private static final Boolean UPDATED_STATUT = true;

    private static final String ENTITY_API_URL = "/api/rendez-vous";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private MockMvc restRendezVousMockMvc;

    private RendezVous rendezVous;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createEntity() {
        RendezVous rendezVous = new RendezVous().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN).statut(DEFAULT_STATUT);
        return rendezVous;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createUpdatedEntity() {
        RendezVous rendezVous = new RendezVous().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN).statut(UPDATED_STATUT);
        return rendezVous;
    }

    @BeforeEach
    public void initTest() {
        rendezVousRepository.deleteAll();
        rendezVous = createEntity();
    }

    @Test
    void createRendezVous() throws Exception {
        int databaseSizeBeforeCreate = rendezVousRepository.findAll().size();
        // Create the RendezVous
        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isCreated());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeCreate + 1);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testRendezVous.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testRendezVous.getStatut()).isEqualTo(DEFAULT_STATUT);
    }

    @Test
    void createRendezVousWithExistingId() throws Exception {
        // Create the RendezVous with an existing ID
        rendezVous.setId("existing_id");

        int databaseSizeBeforeCreate = rendezVousRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.save(rendezVous);

        // Get all the rendezVousList
        restRendezVousMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rendezVous.getId())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.booleanValue())));
    }

    @Test
    void getRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.save(rendezVous);

        // Get the rendezVous
        restRendezVousMockMvc
            .perform(get(ENTITY_API_URL_ID, rendezVous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rendezVous.getId()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.booleanValue()));
    }

    @Test
    void getNonExistingRendezVous() throws Exception {
        // Get the rendezVous
        restRendezVousMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.save(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous
        RendezVous updatedRendezVous = rendezVousRepository.findById(rendezVous.getId()).orElseThrow();
        updatedRendezVous.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN).statut(UPDATED_STATUT);

        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRendezVous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testRendezVous.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testRendezVous.getStatut()).isEqualTo(UPDATED_STATUT);
    }

    @Test
    void putNonExistingRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rendezVous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateRendezVousWithPatch() throws Exception {
        // Initialize the database
        rendezVousRepository.save(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous using partial update
        RendezVous partialUpdatedRendezVous = new RendezVous();
        partialUpdatedRendezVous.setId(rendezVous.getId());

        partialUpdatedRendezVous.dateFin(UPDATED_DATE_FIN).statut(UPDATED_STATUT);

        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testRendezVous.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testRendezVous.getStatut()).isEqualTo(UPDATED_STATUT);
    }

    @Test
    void fullUpdateRendezVousWithPatch() throws Exception {
        // Initialize the database
        rendezVousRepository.save(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous using partial update
        RendezVous partialUpdatedRendezVous = new RendezVous();
        partialUpdatedRendezVous.setId(rendezVous.getId());

        partialUpdatedRendezVous.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN).statut(UPDATED_STATUT);

        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testRendezVous.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testRendezVous.getStatut()).isEqualTo(UPDATED_STATUT);
    }

    @Test
    void patchNonExistingRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.save(rendezVous);

        int databaseSizeBeforeDelete = rendezVousRepository.findAll().size();

        // Delete the rendezVous
        restRendezVousMockMvc
            .perform(delete(ENTITY_API_URL_ID, rendezVous.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
