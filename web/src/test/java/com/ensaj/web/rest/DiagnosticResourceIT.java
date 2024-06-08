package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Diagnostic;
import com.ensaj.repository.DiagnosticRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link DiagnosticResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DiagnosticResourceIT {

    private static final Instant DEFAULT_DATE_DIAGNOSTIC = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DIAGNOSTIC = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PRESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_PRESCRIPTION = "BBBBBBBBBB";

    private static final Float DEFAULT_PROBABILITY = 1F;
    private static final Float UPDATED_PROBABILITY = 2F;

    private static final String ENTITY_API_URL = "/api/diagnostics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private DiagnosticRepository diagnosticRepository;

    @Autowired
    private MockMvc restDiagnosticMockMvc;

    private Diagnostic diagnostic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Diagnostic createEntity() {
        Diagnostic diagnostic = new Diagnostic()
            .dateDiagnostic(DEFAULT_DATE_DIAGNOSTIC)
            .picture(DEFAULT_PICTURE)
            .pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .prescription(DEFAULT_PRESCRIPTION)
            .probability(DEFAULT_PROBABILITY);
        return diagnostic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Diagnostic createUpdatedEntity() {
        Diagnostic diagnostic = new Diagnostic()
            .dateDiagnostic(UPDATED_DATE_DIAGNOSTIC)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .prescription(UPDATED_PRESCRIPTION)
            .probability(UPDATED_PROBABILITY);
        return diagnostic;
    }

    @BeforeEach
    public void initTest() {
        diagnosticRepository.deleteAll();
        diagnostic = createEntity();
    }

    @Test
    void createDiagnostic() throws Exception {
        int databaseSizeBeforeCreate = diagnosticRepository.findAll().size();
        // Create the Diagnostic
        restDiagnosticMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diagnostic)))
            .andExpect(status().isCreated());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeCreate + 1);
        Diagnostic testDiagnostic = diagnosticList.get(diagnosticList.size() - 1);
        assertThat(testDiagnostic.getDateDiagnostic()).isEqualTo(DEFAULT_DATE_DIAGNOSTIC);
        assertThat(testDiagnostic.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testDiagnostic.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
        assertThat(testDiagnostic.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDiagnostic.getPrescription()).isEqualTo(DEFAULT_PRESCRIPTION);
        assertThat(testDiagnostic.getProbability()).isEqualTo(DEFAULT_PROBABILITY);
    }

    @Test
    void createDiagnosticWithExistingId() throws Exception {
        // Create the Diagnostic with an existing ID
        diagnostic.setId("existing_id");

        int databaseSizeBeforeCreate = diagnosticRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiagnosticMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diagnostic)))
            .andExpect(status().isBadRequest());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllDiagnostics() throws Exception {
        // Initialize the database
        diagnosticRepository.save(diagnostic);

        // Get all the diagnosticList
        restDiagnosticMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(diagnostic.getId())))
            .andExpect(jsonPath("$.[*].dateDiagnostic").value(hasItem(DEFAULT_DATE_DIAGNOSTIC.toString())))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].prescription").value(hasItem(DEFAULT_PRESCRIPTION)))
            .andExpect(jsonPath("$.[*].probability").value(hasItem(DEFAULT_PROBABILITY.doubleValue())));
    }

    @Test
    void getDiagnostic() throws Exception {
        // Initialize the database
        diagnosticRepository.save(diagnostic);

        // Get the diagnostic
        restDiagnosticMockMvc
            .perform(get(ENTITY_API_URL_ID, diagnostic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(diagnostic.getId()))
            .andExpect(jsonPath("$.dateDiagnostic").value(DEFAULT_DATE_DIAGNOSTIC.toString()))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.prescription").value(DEFAULT_PRESCRIPTION))
            .andExpect(jsonPath("$.probability").value(DEFAULT_PROBABILITY.doubleValue()));
    }

    @Test
    void getNonExistingDiagnostic() throws Exception {
        // Get the diagnostic
        restDiagnosticMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingDiagnostic() throws Exception {
        // Initialize the database
        diagnosticRepository.save(diagnostic);

        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();

        // Update the diagnostic
        Diagnostic updatedDiagnostic = diagnosticRepository.findById(diagnostic.getId()).orElseThrow();
        updatedDiagnostic
            .dateDiagnostic(UPDATED_DATE_DIAGNOSTIC)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .prescription(UPDATED_PRESCRIPTION)
            .probability(UPDATED_PROBABILITY);

        restDiagnosticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiagnostic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDiagnostic))
            )
            .andExpect(status().isOk());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
        Diagnostic testDiagnostic = diagnosticList.get(diagnosticList.size() - 1);
        assertThat(testDiagnostic.getDateDiagnostic()).isEqualTo(UPDATED_DATE_DIAGNOSTIC);
        assertThat(testDiagnostic.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testDiagnostic.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testDiagnostic.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDiagnostic.getPrescription()).isEqualTo(UPDATED_PRESCRIPTION);
        assertThat(testDiagnostic.getProbability()).isEqualTo(UPDATED_PROBABILITY);
    }

    @Test
    void putNonExistingDiagnostic() throws Exception {
        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();
        diagnostic.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiagnosticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, diagnostic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnostic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDiagnostic() throws Exception {
        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();
        diagnostic.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diagnostic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDiagnostic() throws Exception {
        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();
        diagnostic.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosticMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diagnostic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDiagnosticWithPatch() throws Exception {
        // Initialize the database
        diagnosticRepository.save(diagnostic);

        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();

        // Update the diagnostic using partial update
        Diagnostic partialUpdatedDiagnostic = new Diagnostic();
        partialUpdatedDiagnostic.setId(diagnostic.getId());

        partialUpdatedDiagnostic
            .dateDiagnostic(UPDATED_DATE_DIAGNOSTIC)
            .description(UPDATED_DESCRIPTION)
            .prescription(UPDATED_PRESCRIPTION);

        restDiagnosticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiagnostic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiagnostic))
            )
            .andExpect(status().isOk());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
        Diagnostic testDiagnostic = diagnosticList.get(diagnosticList.size() - 1);
        assertThat(testDiagnostic.getDateDiagnostic()).isEqualTo(UPDATED_DATE_DIAGNOSTIC);
        assertThat(testDiagnostic.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testDiagnostic.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
        assertThat(testDiagnostic.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDiagnostic.getPrescription()).isEqualTo(UPDATED_PRESCRIPTION);
        assertThat(testDiagnostic.getProbability()).isEqualTo(DEFAULT_PROBABILITY);
    }

    @Test
    void fullUpdateDiagnosticWithPatch() throws Exception {
        // Initialize the database
        diagnosticRepository.save(diagnostic);

        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();

        // Update the diagnostic using partial update
        Diagnostic partialUpdatedDiagnostic = new Diagnostic();
        partialUpdatedDiagnostic.setId(diagnostic.getId());

        partialUpdatedDiagnostic
            .dateDiagnostic(UPDATED_DATE_DIAGNOSTIC)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .prescription(UPDATED_PRESCRIPTION)
            .probability(UPDATED_PROBABILITY);

        restDiagnosticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiagnostic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiagnostic))
            )
            .andExpect(status().isOk());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
        Diagnostic testDiagnostic = diagnosticList.get(diagnosticList.size() - 1);
        assertThat(testDiagnostic.getDateDiagnostic()).isEqualTo(UPDATED_DATE_DIAGNOSTIC);
        assertThat(testDiagnostic.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testDiagnostic.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testDiagnostic.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDiagnostic.getPrescription()).isEqualTo(UPDATED_PRESCRIPTION);
        assertThat(testDiagnostic.getProbability()).isEqualTo(UPDATED_PROBABILITY);
    }

    @Test
    void patchNonExistingDiagnostic() throws Exception {
        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();
        diagnostic.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiagnosticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, diagnostic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diagnostic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDiagnostic() throws Exception {
        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();
        diagnostic.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diagnostic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDiagnostic() throws Exception {
        int databaseSizeBeforeUpdate = diagnosticRepository.findAll().size();
        diagnostic.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiagnosticMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(diagnostic))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Diagnostic in the database
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDiagnostic() throws Exception {
        // Initialize the database
        diagnosticRepository.save(diagnostic);

        int databaseSizeBeforeDelete = diagnosticRepository.findAll().size();

        // Delete the diagnostic
        restDiagnosticMockMvc
            .perform(delete(ENTITY_API_URL_ID, diagnostic.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Diagnostic> diagnosticList = diagnosticRepository.findAll();
        assertThat(diagnosticList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
